import { get } from 'node:http';
import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("games")
      .where("title ilike :title", {title: `%${param}%`}).getMany();

  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(id) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {

    const dados = await this.repository.createQueryBuilder("games")     
    .innerJoinAndSelect("games.users", "user")   
    .addSelect("user")
    .where("games.id = :id", { id })  
    .relation(Game, 'users')
    .of(id)    
    .loadMany();
    return dados;
  }
}
