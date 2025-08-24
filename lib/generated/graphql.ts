export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigFloat: { input: string; output: string; }
  BigInt: { input: string; output: string; }
  Cursor: { input: any; output: any; }
  Date: { input: any; output: any; }
  Datetime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Opaque: { input: any; output: any; }
  Time: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

/** Boolean expression comparing fields on type "BigFloat" */
export type BigFloatFilter = {
  eq?: InputMaybe<Scalars['BigFloat']['input']>;
  gt?: InputMaybe<Scalars['BigFloat']['input']>;
  gte?: InputMaybe<Scalars['BigFloat']['input']>;
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigFloat']['input']>;
  lte?: InputMaybe<Scalars['BigFloat']['input']>;
  neq?: InputMaybe<Scalars['BigFloat']['input']>;
};

/** Boolean expression comparing fields on type "BigFloatList" */
export type BigFloatListFilter = {
  containedBy?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  contains?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  eq?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
};

/** Boolean expression comparing fields on type "BigInt" */
export type BigIntFilter = {
  eq?: InputMaybe<Scalars['BigInt']['input']>;
  gt?: InputMaybe<Scalars['BigInt']['input']>;
  gte?: InputMaybe<Scalars['BigInt']['input']>;
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigInt']['input']>;
  lte?: InputMaybe<Scalars['BigInt']['input']>;
  neq?: InputMaybe<Scalars['BigInt']['input']>;
};

/** Boolean expression comparing fields on type "BigIntList" */
export type BigIntListFilter = {
  containedBy?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  eq?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

/** Boolean expression comparing fields on type "Boolean" */
export type BooleanFilter = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Boolean expression comparing fields on type "BooleanList" */
export type BooleanListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  contains?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  eq?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression comparing fields on type "Date" */
export type DateFilter = {
  eq?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  neq?: InputMaybe<Scalars['Date']['input']>;
};

/** Boolean expression comparing fields on type "DateList" */
export type DateListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Date']['input']>>;
  contains?: InputMaybe<Array<Scalars['Date']['input']>>;
  eq?: InputMaybe<Array<Scalars['Date']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Date']['input']>>;
};

/** Boolean expression comparing fields on type "Datetime" */
export type DatetimeFilter = {
  eq?: InputMaybe<Scalars['Datetime']['input']>;
  gt?: InputMaybe<Scalars['Datetime']['input']>;
  gte?: InputMaybe<Scalars['Datetime']['input']>;
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Datetime']['input']>;
  lte?: InputMaybe<Scalars['Datetime']['input']>;
  neq?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Boolean expression comparing fields on type "DatetimeList" */
export type DatetimeListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  contains?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  eq?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Datetime']['input']>>;
};

export enum FilterIs {
  NotNull = 'NOT_NULL',
  Null = 'NULL'
}

/** Boolean expression comparing fields on type "Float" */
export type FloatFilter = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
};

/** Boolean expression comparing fields on type "FloatList" */
export type FloatListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Float']['input']>>;
  contains?: InputMaybe<Array<Scalars['Float']['input']>>;
  eq?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Float']['input']>>;
};

/** Boolean expression comparing fields on type "ID" */
export type IdFilter = {
  eq?: InputMaybe<Scalars['ID']['input']>;
};

/** Boolean expression comparing fields on type "Int" */
export type IntFilter = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
};

/** Boolean expression comparing fields on type "IntList" */
export type IntListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Int']['input']>>;
  contains?: InputMaybe<Array<Scalars['Int']['input']>>;
  eq?: InputMaybe<Array<Scalars['Int']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** The root type for creating and mutating data */
export type Mutation = {
  __typename?: 'Mutation';
  /** Deletes zero or more records from the `notes` collection */
  deleteFromnotesCollection: NotesDeleteResponse;
  /** Deletes zero or more records from the `pools` collection */
  deleteFrompoolsCollection: PoolsDeleteResponse;
  /** Deletes zero or more records from the `trades` collection */
  deleteFromtradesCollection: TradesDeleteResponse;
  /** Deletes zero or more records from the `user_trades` collection */
  deleteFromuser_tradesCollection: User_TradesDeleteResponse;
  /** Adds one or more `notes` records to the collection */
  insertIntonotesCollection?: Maybe<NotesInsertResponse>;
  /** Adds one or more `pools` records to the collection */
  insertIntopoolsCollection?: Maybe<PoolsInsertResponse>;
  /** Adds one or more `trades` records to the collection */
  insertIntotradesCollection?: Maybe<TradesInsertResponse>;
  /** Adds one or more `user_trades` records to the collection */
  insertIntouser_tradesCollection?: Maybe<User_TradesInsertResponse>;
  insert_trade_safe?: Maybe<Scalars['UUID']['output']>;
  /** Updates zero or more records in the `notes` collection */
  updatenotesCollection: NotesUpdateResponse;
  /** Updates zero or more records in the `pools` collection */
  updatepoolsCollection: PoolsUpdateResponse;
  /** Updates zero or more records in the `trades` collection */
  updatetradesCollection: TradesUpdateResponse;
  /** Updates zero or more records in the `user_trades` collection */
  updateuser_tradesCollection: User_TradesUpdateResponse;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromnotesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<NotesFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFrompoolsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PoolsFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromtradesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<TradesFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromuser_TradesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<User_TradesFilter>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntonotesCollectionArgs = {
  objects: Array<NotesInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntopoolsCollectionArgs = {
  objects: Array<PoolsInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntotradesCollectionArgs = {
  objects: Array<TradesInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntouser_TradesCollectionArgs = {
  objects: Array<User_TradesInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsert_Trade_SafeArgs = {
  p_amount_a: Scalars['BigFloat']['input'];
  p_amount_b: Scalars['BigFloat']['input'];
  p_block_number: Scalars['BigInt']['input'];
  p_pool_id: Scalars['String']['input'];
  p_token_a: Scalars['String']['input'];
  p_token_b: Scalars['String']['input'];
  p_tx_hash: Scalars['String']['input'];
  p_user_address: Scalars['String']['input'];
};


/** The root type for creating and mutating data */
export type MutationUpdatenotesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<NotesFilter>;
  set: NotesUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatepoolsCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PoolsFilter>;
  set: PoolsUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatetradesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<TradesFilter>;
  set: TradesUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateuser_TradesCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<User_TradesFilter>;
  set: User_TradesUpdateInput;
};

export type Node = {
  /** Retrieves a record by `ID` */
  nodeId: Scalars['ID']['output'];
};

/** Boolean expression comparing fields on type "Opaque" */
export type OpaqueFilter = {
  eq?: InputMaybe<Scalars['Opaque']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Defines a per-field sorting order */
export enum OrderByDirection {
  /** Ascending order, nulls first */
  AscNullsFirst = 'AscNullsFirst',
  /** Ascending order, nulls last */
  AscNullsLast = 'AscNullsLast',
  /** Descending order, nulls first */
  DescNullsFirst = 'DescNullsFirst',
  /** Descending order, nulls last */
  DescNullsLast = 'DescNullsLast'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** The root type for querying data */
export type Query = {
  __typename?: 'Query';
  /** Retrieve a record by its `ID` */
  node?: Maybe<Node>;
  /** A pagable collection of type `notes` */
  notesCollection?: Maybe<NotesConnection>;
  /** A pagable collection of type `pools` */
  poolsCollection?: Maybe<PoolsConnection>;
  /** A pagable collection of type `trades` */
  tradesCollection?: Maybe<TradesConnection>;
  /** A pagable collection of type `user_trades` */
  user_tradesCollection?: Maybe<User_TradesConnection>;
};


/** The root type for querying data */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root type for querying data */
export type QueryNotesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<NotesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotesOrderBy>>;
};


/** The root type for querying data */
export type QueryPoolsCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PoolsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PoolsOrderBy>>;
};


/** The root type for querying data */
export type QueryTradesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<TradesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TradesOrderBy>>;
};


/** The root type for querying data */
export type QueryUser_TradesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<User_TradesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<User_TradesOrderBy>>;
};

/** Boolean expression comparing fields on type "String" */
export type StringFilter = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  iregex?: InputMaybe<Scalars['String']['input']>;
  is?: InputMaybe<FilterIs>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression comparing fields on type "StringList" */
export type StringListFilter = {
  containedBy?: InputMaybe<Array<Scalars['String']['input']>>;
  contains?: InputMaybe<Array<Scalars['String']['input']>>;
  eq?: InputMaybe<Array<Scalars['String']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Boolean expression comparing fields on type "Time" */
export type TimeFilter = {
  eq?: InputMaybe<Scalars['Time']['input']>;
  gt?: InputMaybe<Scalars['Time']['input']>;
  gte?: InputMaybe<Scalars['Time']['input']>;
  in?: InputMaybe<Array<Scalars['Time']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Time']['input']>;
  lte?: InputMaybe<Scalars['Time']['input']>;
  neq?: InputMaybe<Scalars['Time']['input']>;
};

/** Boolean expression comparing fields on type "TimeList" */
export type TimeListFilter = {
  containedBy?: InputMaybe<Array<Scalars['Time']['input']>>;
  contains?: InputMaybe<Array<Scalars['Time']['input']>>;
  eq?: InputMaybe<Array<Scalars['Time']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['Time']['input']>>;
};

/** Boolean expression comparing fields on type "UUID" */
export type UuidFilter = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
};

/** Boolean expression comparing fields on type "UUIDList" */
export type UuidListFilter = {
  containedBy?: InputMaybe<Array<Scalars['UUID']['input']>>;
  contains?: InputMaybe<Array<Scalars['UUID']['input']>>;
  eq?: InputMaybe<Array<Scalars['UUID']['input']>>;
  is?: InputMaybe<FilterIs>;
  overlaps?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

export type Notes = Node & {
  __typename?: 'notes';
  id: Scalars['BigInt']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type NotesConnection = {
  __typename?: 'notesConnection';
  edges: Array<NotesEdge>;
  pageInfo: PageInfo;
};

export type NotesDeleteResponse = {
  __typename?: 'notesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Notes>;
};

export type NotesEdge = {
  __typename?: 'notesEdge';
  cursor: Scalars['String']['output'];
  node: Notes;
};

export type NotesFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<NotesFilter>>;
  id?: InputMaybe<BigIntFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<NotesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<NotesFilter>>;
  title?: InputMaybe<StringFilter>;
};

export type NotesInsertInput = {
  title?: InputMaybe<Scalars['String']['input']>;
};

export type NotesInsertResponse = {
  __typename?: 'notesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Notes>;
};

export type NotesOrderBy = {
  id?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
};

export type NotesUpdateInput = {
  title?: InputMaybe<Scalars['String']['input']>;
};

export type NotesUpdateResponse = {
  __typename?: 'notesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Notes>;
};

export type Pools = Node & {
  __typename?: 'pools';
  created_at: Scalars['Datetime']['output'];
  fee_tier: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  last_updated: Scalars['Datetime']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  token_a: Scalars['String']['output'];
  token_a_symbol: Scalars['String']['output'];
  token_b: Scalars['String']['output'];
  token_b_symbol: Scalars['String']['output'];
  total_value_locked_a?: Maybe<Scalars['BigFloat']['output']>;
  total_value_locked_b?: Maybe<Scalars['BigFloat']['output']>;
  volume_24h_a?: Maybe<Scalars['BigFloat']['output']>;
  volume_24h_b?: Maybe<Scalars['BigFloat']['output']>;
};

export type PoolsConnection = {
  __typename?: 'poolsConnection';
  edges: Array<PoolsEdge>;
  pageInfo: PageInfo;
};

export type PoolsDeleteResponse = {
  __typename?: 'poolsDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Pools>;
};

export type PoolsEdge = {
  __typename?: 'poolsEdge';
  cursor: Scalars['String']['output'];
  node: Pools;
};

export type PoolsFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<PoolsFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  fee_tier?: InputMaybe<IntFilter>;
  id?: InputMaybe<StringFilter>;
  last_updated?: InputMaybe<DatetimeFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<PoolsFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<PoolsFilter>>;
  token_a?: InputMaybe<StringFilter>;
  token_a_symbol?: InputMaybe<StringFilter>;
  token_b?: InputMaybe<StringFilter>;
  token_b_symbol?: InputMaybe<StringFilter>;
  total_value_locked_a?: InputMaybe<BigFloatFilter>;
  total_value_locked_b?: InputMaybe<BigFloatFilter>;
  volume_24h_a?: InputMaybe<BigFloatFilter>;
  volume_24h_b?: InputMaybe<BigFloatFilter>;
};

export type PoolsInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  fee_tier?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  last_updated?: InputMaybe<Scalars['Datetime']['input']>;
  token_a?: InputMaybe<Scalars['String']['input']>;
  token_a_symbol?: InputMaybe<Scalars['String']['input']>;
  token_b?: InputMaybe<Scalars['String']['input']>;
  token_b_symbol?: InputMaybe<Scalars['String']['input']>;
  total_value_locked_a?: InputMaybe<Scalars['BigFloat']['input']>;
  total_value_locked_b?: InputMaybe<Scalars['BigFloat']['input']>;
  volume_24h_a?: InputMaybe<Scalars['BigFloat']['input']>;
  volume_24h_b?: InputMaybe<Scalars['BigFloat']['input']>;
};

export type PoolsInsertResponse = {
  __typename?: 'poolsInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Pools>;
};

export type PoolsOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  fee_tier?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  last_updated?: InputMaybe<OrderByDirection>;
  token_a?: InputMaybe<OrderByDirection>;
  token_a_symbol?: InputMaybe<OrderByDirection>;
  token_b?: InputMaybe<OrderByDirection>;
  token_b_symbol?: InputMaybe<OrderByDirection>;
  total_value_locked_a?: InputMaybe<OrderByDirection>;
  total_value_locked_b?: InputMaybe<OrderByDirection>;
  volume_24h_a?: InputMaybe<OrderByDirection>;
  volume_24h_b?: InputMaybe<OrderByDirection>;
};

export type PoolsUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  fee_tier?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  last_updated?: InputMaybe<Scalars['Datetime']['input']>;
  token_a?: InputMaybe<Scalars['String']['input']>;
  token_a_symbol?: InputMaybe<Scalars['String']['input']>;
  token_b?: InputMaybe<Scalars['String']['input']>;
  token_b_symbol?: InputMaybe<Scalars['String']['input']>;
  total_value_locked_a?: InputMaybe<Scalars['BigFloat']['input']>;
  total_value_locked_b?: InputMaybe<Scalars['BigFloat']['input']>;
  volume_24h_a?: InputMaybe<Scalars['BigFloat']['input']>;
  volume_24h_b?: InputMaybe<Scalars['BigFloat']['input']>;
};

export type PoolsUpdateResponse = {
  __typename?: 'poolsUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Pools>;
};

export type Trades = Node & {
  __typename?: 'trades';
  amount_a: Scalars['BigFloat']['output'];
  amount_b: Scalars['BigFloat']['output'];
  block_number: Scalars['BigInt']['output'];
  created_at: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  pool_id: Scalars['String']['output'];
  timestamp: Scalars['Datetime']['output'];
  token_a: Scalars['String']['output'];
  token_b: Scalars['String']['output'];
  tx_hash: Scalars['String']['output'];
  user_address: Scalars['String']['output'];
  user_tradesCollection?: Maybe<User_TradesConnection>;
};


export type TradesUser_TradesCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<User_TradesFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<User_TradesOrderBy>>;
};

export type TradesConnection = {
  __typename?: 'tradesConnection';
  edges: Array<TradesEdge>;
  pageInfo: PageInfo;
};

export type TradesDeleteResponse = {
  __typename?: 'tradesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trades>;
};

export type TradesEdge = {
  __typename?: 'tradesEdge';
  cursor: Scalars['String']['output'];
  node: Trades;
};

export type TradesFilter = {
  amount_a?: InputMaybe<BigFloatFilter>;
  amount_b?: InputMaybe<BigFloatFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<TradesFilter>>;
  block_number?: InputMaybe<BigIntFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<TradesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<TradesFilter>>;
  pool_id?: InputMaybe<StringFilter>;
  timestamp?: InputMaybe<DatetimeFilter>;
  token_a?: InputMaybe<StringFilter>;
  token_b?: InputMaybe<StringFilter>;
  tx_hash?: InputMaybe<StringFilter>;
  user_address?: InputMaybe<StringFilter>;
};

export type TradesInsertInput = {
  amount_a?: InputMaybe<Scalars['BigFloat']['input']>;
  amount_b?: InputMaybe<Scalars['BigFloat']['input']>;
  block_number?: InputMaybe<Scalars['BigInt']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  pool_id?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Datetime']['input']>;
  token_a?: InputMaybe<Scalars['String']['input']>;
  token_b?: InputMaybe<Scalars['String']['input']>;
  tx_hash?: InputMaybe<Scalars['String']['input']>;
  user_address?: InputMaybe<Scalars['String']['input']>;
};

export type TradesInsertResponse = {
  __typename?: 'tradesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trades>;
};

export type TradesOrderBy = {
  amount_a?: InputMaybe<OrderByDirection>;
  amount_b?: InputMaybe<OrderByDirection>;
  block_number?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  pool_id?: InputMaybe<OrderByDirection>;
  timestamp?: InputMaybe<OrderByDirection>;
  token_a?: InputMaybe<OrderByDirection>;
  token_b?: InputMaybe<OrderByDirection>;
  tx_hash?: InputMaybe<OrderByDirection>;
  user_address?: InputMaybe<OrderByDirection>;
};

export type TradesUpdateInput = {
  amount_a?: InputMaybe<Scalars['BigFloat']['input']>;
  amount_b?: InputMaybe<Scalars['BigFloat']['input']>;
  block_number?: InputMaybe<Scalars['BigInt']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  pool_id?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Datetime']['input']>;
  token_a?: InputMaybe<Scalars['String']['input']>;
  token_b?: InputMaybe<Scalars['String']['input']>;
  tx_hash?: InputMaybe<Scalars['String']['input']>;
  user_address?: InputMaybe<Scalars['String']['input']>;
};

export type TradesUpdateResponse = {
  __typename?: 'tradesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Trades>;
};

export type User_Trades = Node & {
  __typename?: 'user_trades';
  amount_a: Scalars['BigFloat']['output'];
  amount_b: Scalars['BigFloat']['output'];
  created_at: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  pool_id: Scalars['String']['output'];
  timestamp: Scalars['Datetime']['output'];
  trade_id: Scalars['UUID']['output'];
  trade_type: Scalars['String']['output'];
  trades?: Maybe<Trades>;
  user_address: Scalars['String']['output'];
};

export type User_TradesConnection = {
  __typename?: 'user_tradesConnection';
  edges: Array<User_TradesEdge>;
  pageInfo: PageInfo;
};

export type User_TradesDeleteResponse = {
  __typename?: 'user_tradesDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<User_Trades>;
};

export type User_TradesEdge = {
  __typename?: 'user_tradesEdge';
  cursor: Scalars['String']['output'];
  node: User_Trades;
};

export type User_TradesFilter = {
  amount_a?: InputMaybe<BigFloatFilter>;
  amount_b?: InputMaybe<BigFloatFilter>;
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<User_TradesFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  id?: InputMaybe<UuidFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<User_TradesFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<User_TradesFilter>>;
  pool_id?: InputMaybe<StringFilter>;
  timestamp?: InputMaybe<DatetimeFilter>;
  trade_id?: InputMaybe<UuidFilter>;
  trade_type?: InputMaybe<StringFilter>;
  user_address?: InputMaybe<StringFilter>;
};

export type User_TradesInsertInput = {
  amount_a?: InputMaybe<Scalars['BigFloat']['input']>;
  amount_b?: InputMaybe<Scalars['BigFloat']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  pool_id?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Datetime']['input']>;
  trade_id?: InputMaybe<Scalars['UUID']['input']>;
  trade_type?: InputMaybe<Scalars['String']['input']>;
  user_address?: InputMaybe<Scalars['String']['input']>;
};

export type User_TradesInsertResponse = {
  __typename?: 'user_tradesInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<User_Trades>;
};

export type User_TradesOrderBy = {
  amount_a?: InputMaybe<OrderByDirection>;
  amount_b?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  pool_id?: InputMaybe<OrderByDirection>;
  timestamp?: InputMaybe<OrderByDirection>;
  trade_id?: InputMaybe<OrderByDirection>;
  trade_type?: InputMaybe<OrderByDirection>;
  user_address?: InputMaybe<OrderByDirection>;
};

export type User_TradesUpdateInput = {
  amount_a?: InputMaybe<Scalars['BigFloat']['input']>;
  amount_b?: InputMaybe<Scalars['BigFloat']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  pool_id?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Datetime']['input']>;
  trade_id?: InputMaybe<Scalars['UUID']['input']>;
  trade_type?: InputMaybe<Scalars['String']['input']>;
  user_address?: InputMaybe<Scalars['String']['input']>;
};

export type User_TradesUpdateResponse = {
  __typename?: 'user_tradesUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<User_Trades>;
};

export type GetTradesQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetTradesQuery = { __typename?: 'Query', tradesCollection?: { __typename?: 'tradesConnection', edges: Array<{ __typename?: 'tradesEdge', node: { __typename?: 'trades', id: any, pool_id: string, token_a: string, token_b: string, amount_a: string, amount_b: string, user_address: string, tx_hash: string, block_number: string, created_at: any } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type Get24hVolumeQueryVariables = Exact<{
  pool_id: Scalars['String']['input'];
}>;


export type Get24hVolumeQuery = { __typename?: 'Query', tradesCollection?: { __typename?: 'tradesConnection', edges: Array<{ __typename?: 'tradesEdge', node: { __typename?: 'trades', amount_a: string, amount_b: string } }> } | null };
