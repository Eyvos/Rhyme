import { RhymeTable, UserTable } from '../DB/DataAccess';
import { Op } from 'sequelize';
import { Error } from '../models/error';
require('dotenv').config();
import OpenAI from 'openai';
import { IRhyme } from '../models/rhyme';
import { IUser } from '../models/user';

export class RhymeService {
    static findAll = async (page = 1, limit = 20, title = ''): Promise<IRhyme[]> => {
        try {
            const rhymes: IRhyme[] = await RhymeTable.findAll({
                where: {
                    title: {
                        [Op.like]: `%${title}%`
                    }
                },
                limit: limit,
                offset: (page - 1) * limit
            });
            if (!rhymes.length) {
                let err = new Error('No rhyme found', 404);
                throw err;
            }
    
            return rhymes;
        } catch (err) {
            throw err
        }
    }
    
    static findById = async (id: number): Promise<IRhyme> => {
        try {
            const rhyme: IRhyme | null = await RhymeTable.findByPk(id);
            if (!rhyme) {
                let err = new Error('Rhyme not found', 404);
                throw err
            }
    
            return rhyme
        } catch (err) {
            throw err
        }
    }
    
    static findByParentId = async (parentId: number, page = 1, limit = 20): Promise<IRhyme[]> => {
        try {
            const rhymes: IRhyme[] = await RhymeTable.findAll({
                where: {
                    parentId: parentId
                },
                limit: limit,
                offset: (page - 1) * limit
            });
            if (!rhymes) {
                let err = new Error('Rhyme not found', 404);
                throw err
            }
    
            return rhymes
        } catch (err) {
            throw err
        }
    }
    
    static create = async (title: string, content: string, userId: number, parentId: number | undefined = undefined): Promise<void> => {
        try {
            if (parentId) {
                let parent: IRhyme | null = await RhymeTable.findByPk(parentId);
                if (!parent) {
                    let err = new Error('Parent rhyme not found', 404);
                    throw err
                }
            }
            //check if user exists
            const user: IUser | null = await UserTable.findByPk(userId);
            if (!user) {
                let err = new Error('User not found', 404);
                throw err
            }
    
            if (content) {
                const firstLetters = content
                    .split("\n")
                    .map(element => element.trim().toLowerCase()[0])
                    .join('');
                if (firstLetters !== title.toLowerCase()) {
                    let err = new Error('Invalid Rhyme: Content does not match title', 400);
                    throw err
                }
            }
    
            const rhyme: IRhyme = await RhymeTable.create({
                title: title,
                content: content,
                userId: userId,
                parentId: parentId,
                isGenerated: false
            })
            if (!rhyme) {
                let err = new Error('Rhyme can\'t be created', 404);
                throw err
            }
        } catch (err) {
            throw err
        }
    }
    
    static generate = async (title: string, userId: number) => {
        //check if user exists
        try {
            let user : IUser | null = await UserTable.findByPk(userId);
            if (!user) {
                let err = new Error('User not found', 404);
                throw err
            }
            //calling chatGPT API
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_SECRET_KEY,
            });
            let chatCompletion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: "Tu es un spécialiste en poésie et création d'acrostiche."
                    },
                    {
                        role: 'user',
                        content: `Crée un seul acrostiche avec le titre: ${title}`
                    }
                ],
                max_tokens: 50,
            });
            let contentSplited: string[] = chatCompletion.choices[0].message.content?.split('\n') ?? [];
            
            if (contentSplited.length < title.length) 
                throw new Error('Rhyme generation failed', 500);

            for (let i = 0; i < title.length; i++) {
                contentSplited[i] = contentSplited[i].trim();
            }

            if (contentSplited) {
                let content: string = `${contentSplited[0]}\n${contentSplited[1]}\n${contentSplited[2]}`
    
                let rhyme = await RhymeTable.create({
                    title: title,
                    content: content,
                    userId: userId,
                    isGenerated: true
                })
        
                if (!rhyme) {
                    let err = new Error('Rhyme can\'t be created', 500);
                    throw err
                }
            }
            
        } catch (err) {
            throw err;
        }
    }
    
    static delete = async (id: number, userId: number) => {
        try {
            let rhymeToDelete = await RhymeService.findById(id);
            if (!rhymeToDelete) {
                let err = new Error('Rhyme not found', 404)
                throw err
            } else {
                if (rhymeToDelete.userId != userId) {
                    let err = new Error('Unauthorized', 401)
                    throw err
                }
            }
            
            await RhymeTable.destroy({
                where: {
                    id: id
                }
            })
            
            const rhyme: IRhyme | null = await RhymeTable.findByPk(id);
    
            if (rhyme) {
                let err = new Error('Rhyme was not deleted', 409)
                throw err
            }
    
            return rhymeToDelete
        } catch (err) {
            throw err
        }
    }
}