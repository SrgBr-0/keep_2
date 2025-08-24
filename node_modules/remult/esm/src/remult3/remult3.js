export const GroupByCountMember = '$count';
export const GroupByForApiKey = Symbol.for('GroupByForApiKey');
export const GroupByOperators = [
    'sum',
    'avg',
    'min',
    'max',
    'distinctCount',
];
const wn = [{ n: 1 }, { n: { $gt: 1 } }];
const wnu = [{ nu: 1 }, { nu: { $gt: 1 } }];
const wnn = [
    { nn: 1 },
    { nn: { $gt: 1 } },
    { nn: null },
];
export const flags = {
    error500RetryCount: 4,
};
/*p1 - issues in https://stackblitz.com/edit/demo-allow-delete-based-on-other-entity:
  - don't like the ensure schema
  - seems like this didn't work well in their version of sqlite:
    ```
    @Entity<TaskUser>('TaskUsers', {
      id: ['taskId', 'userId'],
    })
    ```
  - This could be better
    ```
    sqlExpression: async () => {
        if (!remult.authenticated()) return 'false';
        return (
          '1=' +
          (await sqlRelations(Task).taskUsers.$count({
            userId: [remult.user?.id],
            canDelete: true,
          }))
        );
      },
    ```
  
  -
*/
//p1 - deleteAll({title:undefined}) should throw an error - not return 0 (with direct call to db)
//p1 - remult-create, move db question ahead of auth - everyone needs a database, not everyone need auth
//p1 - allow experimental route registration on remult server, with at least get route, and support redirect, read header and set header - (and the existing get html etc...)
//p2 - add parameter all to deleteMany, and updateMany
//p2  filter.apply ApiPreFilter
//p2 - signIn: (arg) =>withRemult(async () => { - consider if there's a generic way of doing signIn:withRemult(arg=>{})
/*p2 - add id and use uuid by default, but allow changes with Fields.id.defaultIdProvider NO but defaultProvider yes???
  //p2 - replace uuid with crypto.randomUUID and allow custom fallback NO
  //p2 - Add example for luid
  //p2 - add example for nanoid
  //p2 - explain the benefits of changing the default provider for testing in docs.
*/
//p2 - add some kind of options handler that will help with translation etc... like in hagai - something that runs at the stage where options are being built
//p2 - enforce api rules in some backend scenarios - https://discord.com/channels/975754286384418847/1292424895338119239
/*y1 - https://github.com/remult/remult/discussions/438
     - https://github.com/remult/remult/blob/query-argumets/projects/tests/dbs/test-sql-database.spec.ts#L100-L128
     //y1 - consider sql expression gets a dbnames of it's own (that already has the "tableName" defined correctly) maybe also the filter translator
     //p2 - allow preprocess to replace filter values - for example replace $contains on a specific field, with specific other sql - useful for full text search and other scenarios
     //y2 - soft-delete-discussion https://discord.com/channels/975754286384418847/1230386433093533698/1230386433093533698
*/
//p2 - fix query docs to also explain how it can be used for infinite scroll and pagination.
//p2 - when like doesn't have a string - don't send it to the db
//p2 - vite 5.3 supports ts5 decorators - check and adapt.
//p2 - tutorial about controller - and mutable controller
//p2 - docs abount subscription channel
//p2 - add LifecycleEvent to documentation
//p2 - fix chaining of saving and saved in multiple entity options args
//y1 - live query with count #436
//y1 TODO - In the esm version of our tutorial - the imports are automatically .ts and not .js in react and not in vue
//y1 TODO - fix remult admin not to load the html into memory until used
//y2 - talk about insert / update / delete with relations
/*
repo(Order).insert({},{
  relations:{
    orderItems:[{},{},{}]
  }
})
*/
//y2 - repo batch - for multiple operations:
//y2 - request by jy find and count / aggregate with a single call
/*
const result = await repo.batch(x=>({
  data:x.find(),
  count:x.count()
}))
*/
//y1 - wait a second to close stream -see pr
//p1 - prepare the createEntity discussion
//p2 - article on displayValue including it's definition for entities that is used in relations
//p2 - create foreign key constraints in user code - https://codesandbox.io/p/devbox/fk-validator-tdshcs, https://gist.github.com/jycouet/8b264e18c4d8605736f4353062a7d81e
//y2 - should we validate relations
//y1 - dependency of live query tables  live query refresh of view on table update
//y2 - consider replacing all errors with error classes that extend the base Error class
//y2 - should enforce integer - currently we probably round / truncate it
//y1 - talk about filter on objects that are not loaded -  {
//category: repo(CompoundId).create({ company: 7, index: 3, name: '' }),
//    }
/*y1 - talk about modules in init express with entities/controllers,initRequest,initApi
 - support get with backend method, with url search params as the first parameter, & url as second parameter
   - support returning redirect, and plain html (For sign in scenarios)

 */
//p1 - in this video I'll use remult to turn a frontend app to a fullstack app
/*y2 - Talk JYC - JYC - add some integrity checks on delete
  - soft delete
  - delete restrict (implicit, or user selected - and if so, how) (delete & update of id)

*/
//y1 - talk about the parameter issue with backend methods
//y2 - livequery for findfirst (@JY)
/*y2 -
//y2 - allow api update only for new rows
  @Fields.string<Category>({
    allowApiUpdate: (c) => getEntityRef(c).isNew(),
  })
  Description = ""*/
//p1 - get backend methods to work when specifying types for date, and entities as poco's - https://discord.com/channels/975754286384418847/976006081748807690/1289806378864476271
//y2 - constraints (@JY)
//p1 - when a tasks table exists in a different schema - we get many errors
//p1 - live query with include
//y2 - Fix problem with promise all in sql expression recurssion - when using PromiseAll in row relation loading, some sql expressions appear is recursion call even if they are not
//p2 - when subscribe is forbidden - the query still runs after the renew process
//p2 - 'update tasks set  where id = $1
//p2 - when value changes for field with error, clear error - so the user will feel comfortable
//p2 - allowApiUpdate should be false for include in api false
//docs
//------
//y2 - wrap identifier for custom filter & sql expression
//y2 - Should we create a separate implementation of command - one that the user uses, and another that the database implements (with only the bear necesities) - for example, to provide a second paramter called field for toDb conversions
//y2 - should we simply inherit from SqlDataProvider - and send the required parameter in the call to the base class - I think that new SqlDatabase(new PostgresDataProvider()) is a bilt combersome
//y2 - from the crm-demo(https://crm-demo.up.railway.app/deals), after editing a deal: - _updateEntityBasedOnApi
//y1 - how to run a transaction as a user
//y2 - message for relation that is missing
//y2 - consider multi tenancies
//p2 - and validators to reference
//y2 - discuss a default date formatter
//y2 - add some api testing framework for user unit tests (will help with codesandbox based discussions)
//[ ] V2 - what to do about for relations count?
//[ ] V2 - condition? not to fetch if null etc....
