export interface IRhyme{
    id?: number,
    title: string,
    content: string,
    userId: number,
    parentId?: number,
    createdAt?: Date,
    updatedAt?: Date
    isGenerated: boolean // is this rhyme generated by AI or not
}