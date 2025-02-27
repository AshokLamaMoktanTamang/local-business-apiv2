import {
  AnyKeys,
  CreateOptions,
  Model,
  MongooseBaseQueryOptionKeys,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from "mongoose";
import { UpdateOptions } from "mongodb";

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  findOne(
    filter: RootFilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined
  ) {
    return this.model.findOne(filter, projection, options);
  }

  findById(
    id: string,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined
  ) {
    return this.findOne({ _id: id }, projection, options);
  }

  create(
    docs: (T | AnyKeys<T>)[],
    options?: CreateOptions & { aggregateErrors: true }
  ) {
    return this.model.create(docs, options);
  }

  update(
    filter?: RootFilterQuery<T> | undefined,
    update?: UpdateWithAggregationPipeline | UpdateQuery<T> | undefined,
    options?:
      | (UpdateOptions &
          Pick<QueryOptions<T>, MongooseBaseQueryOptionKeys | "timestamps"> & {
            [other: string]: any;
          })
      | null
      | undefined
  ) {
    return this.model.updateOne(filter, update, options);
  }

  updateById(
    id: string,
    update?: UpdateWithAggregationPipeline | UpdateQuery<T> | undefined,
    options?:
      | (UpdateOptions &
          Pick<QueryOptions<T>, MongooseBaseQueryOptionKeys | "timestamps"> & {
            [other: string]: any;
          })
      | null
      | undefined
  ) {
    return this.update({ _id: id }, update, options);
  }
}
