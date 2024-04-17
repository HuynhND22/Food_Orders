import { AppDataSource } from '../data-source';

const checkUnique = async (Models: any, field: string, value:any) => {
    const repository = AppDataSource.getRepository(Models);
    let query = <any>{};
    query[field] = value;
    const existing = await repository.findOne({where: query});
    return !existing;
}

export default checkUnique
