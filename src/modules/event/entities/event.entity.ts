import type { City } from '@modules/city/entities/city.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  QueryFailedError,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'city_id' })
  cityId: string;

  @ManyToOne('City', (city: City) => city.id)
  @JoinColumn({ name: 'city_id' })
  city: City;
}

export function CityConstraintError(e: QueryFailedError): never {
  throw e;
}
