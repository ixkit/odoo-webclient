//
export interface I_ORM {
  /**
   * @param {string} model
   * @param {string} method
   * @param {any[]} [args=[]]
   * @param {any} [kwargs={}]
   * @returns {Promise<any>}
   */
  call(model: string, method: string, args: [], kwargs: any): Promise<any>;

  /**
   * @param {string} model
   * @param {any[]} records
   * @param {any} [kwargs=[]]
   * @returns {Promise<number>}
   */
  create(model: string, records: any[], kwargs: any): Promise<number>;

  /**
   * @param {string} model
   * @param {number[]} ids
   * @param {string[]} fields
   * @param {any} [kwargs={}]
   * @returns {Promise<any[]>}
   */
  read(
    model: string,
    ids: number[],
    fields: string[],
    kwargs: any
  ): Promise<any[]>;

  // /**
  //  * @param {string} model
  //  * @param {import("@web/core/domain").DomainListRepr} domain
  //  * @param {string[]} fields
  //  * @param {string[]} groupby
  //  * @param {any} [kwargs={}]
  //  * @returns {Promise<any[]>}
  //  */
  // readGroup(model, domain, fields, groupby, kwargs = {}) {
  //     validateArray("domain", domain);
  //     validatePrimitiveList("fields", "string", fields);
  //     validatePrimitiveList("groupby", "string", groupby);
  //     groupby = [...new Set(groupby)];
  //     return this.call(model, "read_group", [], { ...kwargs, domain, fields, groupby });
  // }

  // /**
  //  * @param {string} model
  //  * @param {import("@web/core/domain").DomainListRepr} domain
  //  * @param {any} [kwargs={}]
  //  * @returns {Promise<any[]>}
  //  */
  // search(model, domain, kwargs = {}) {
  //     validateArray("domain", domain);
  //     return this.call(model, "search", [domain], kwargs);
  // }

  // /**
  //  * @param {string} model
  //  * @param {import("@web/core/domain").DomainListRepr} domain
  //  * @param {string[]} fields
  //  * @param {any} [kwargs={}]
  //  * @returns {Promise<any[]>}
  //  */
  // searchRead(model, domain, fields, kwargs = {}) {
  //     validateArray("domain", domain);
  //     if (fields) {
  //         validatePrimitiveList("fields", "string", fields);
  //     }
  //     return this.call(model, "search_read", [], { ...kwargs, domain, fields });
  // }

  // /**
  //  * @param {string} model
  //  * @param {import("@web/core/domain").DomainListRepr} domain
  //  * @param {any} [kwargs={}]
  //  * @returns {Promise<number>}
  //  */
  // searchCount(model, domain, kwargs = {}) {
  //     validateArray("domain", domain);
  //     return this.call(model, "search_count", [domain], kwargs);
  // }

  // /**
  //  * @param {string} model
  //  * @param {number[]} ids
  //  * @param {any} [kwargs={}]
  //  * @returns {Promise<boolean>}
  //  */
  // unlink(model, ids, kwargs = {}) {
  //     validatePrimitiveList("ids", "number", ids);
  //     if (!ids.length) {
  //         return Promise.resolve(true);
  //     }
  //     return this.call(model, "unlink", [ids], kwargs);
  // }

  // /**
  //  * @param {string} model
  //  * @param {import("@web/core/domain").DomainListRepr} domain
  //  * @param {string[]} fields
  //  * @param {string[]} groupby
  //  * @param {any} [kwargs={}]
  //  * @returns {Promise<any[]>}
  //  */
  // webReadGroup(model, domain, fields, groupby, kwargs = {}) {
  //     validateArray("domain", domain);
  //     validatePrimitiveList("fields", "string", fields);
  //     validatePrimitiveList("groupby", "string", groupby);
  //     return this.call(model, "web_read_group", [], {
  //         ...kwargs,
  //         groupby,
  //         domain,
  //         fields,
  //     });
  // }

  // /**
  //  * @param {string} model
  //  * @param {number[]} ids
  //  * @param {any} [kwargs={}]
  //  * @param {Object} [kwargs.specification]
  //  * @param {Object} [kwargs.context]
  //  * @returns {Promise<any[]>}
  //  */
  // webRead(model, ids, kwargs = {}) {
  //     validatePrimitiveList("ids", "number", ids);
  //     return this.call(model, "web_read", [ids], kwargs);
  // }

  // /**
  //  * @param {string} model
  //  * @param {import("@web/core/domain").DomainListRepr} domain
  //  * @param {any} [kwargs={}]
  //  * @returns {Promise<any[]>}
  //  */
  // webSearchRead(model, domain, kwargs = {}) {
  //     validateArray("domain", domain);
  //     return this.call(model, "web_search_read", [], { ...kwargs, domain });
  // }

  // /**
  //  * @param {string} model
  //  * @param {number[]} ids
  //  * @param {any} data
  //  * @param {any} [kwargs={}]
  //  * @returns {Promise<boolean>}
  //  */
  // write(model, ids, data, kwargs = {}) {
  //     validatePrimitiveList("ids", "number", ids);
  //     validateObject("data", data);
  //     return this.call(model, "write", [ids, data], kwargs);
  // }

  // /**
  //  * @param {string} model
  //  * @param {number[]} ids
  //  * @param {any} data
  //  * @param {any} [kwargs={}]
  //  * @param {Object} [kwargs.specification]
  //  * @param {Object} [kwargs.context]
  //  * @returns {Promise<any[]>}
  //  */
  // webSave(model, ids, data, kwargs = {}) {
  //     validatePrimitiveList("ids", "number", ids);
  //     validateObject("data", data);
  //     return this.call(model, "web_save", [ids, data], kwargs);
  // }
}
