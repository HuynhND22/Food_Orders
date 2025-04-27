import { AppDataSource } from '../data-source';

const checkUnique = async (Models: any, field: string, value:any) => {
    // console.log('field: ', field, ' value: ', value)
    const repository = AppDataSource.getRepository(Models);
    let query = <any>{};
    query[field] = value;
    const existing = await repository.findOne({withDeleted:true, where: query});
    return !existing;
}

export default checkUnique
