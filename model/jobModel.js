require("dotenv").config();
const env = process.env.ENVIRONMENT;
const config = require("../config/config.json")[env];
const pool = require("../config/database");
const dbtable = config.table_prefix + "jobs";
const dbtable2 = config.table_prefix + "applied_jobs";
const user_kyc = config.table_prefix + "user_kyc";
const send_money = config.table_prefix + "send_money";
const mobile_recharge = config.table_prefix + "mobile_recharge";
const profile_table = config.table_prefix + "user_details";
const review_table = config.table_prefix + "reviews";
const helpers = require("../utilities/helper/general_helper");

var dbModel = {
    add: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable, data);
        qb.release();
        return response;
    },

    apply: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable2, data);
        qb.release();
        return response;
    },

    add_kyc: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(user_kyc, data);
        qb.release();
        return response;
    },

    add_send_money_req: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(send_money, data);
        qb.release();
        return response;
    },

    add_mobile_recharge_req: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(mobile_recharge, data);
        qb.release();
        return response;
    },

    addProfile: async (data) => {
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(profile_table, data);
        qb.release();
        return response;
    },

    delete: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.where(condition).delete(dbtable);
        qb.release();
        console.log(qb.last_query());
        return response;
    },

    select: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select("*").where(condition).get(dbtable);
        qb.release();
        return response;
    },

    select_profile: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select("*").where(condition).get(profile_table);
        qb.release();
        return response;
    },

    select_list: async (condition, date_condition, limit, search) => {
        let qb = await pool.get_connection();
        let final_cond = " where ";

        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }

        if (Object.keys(date_condition).length) {
            let date_condition_str = await helpers.get_date_between_condition(
                date_condition.from_date,
                date_condition.to_date,
                "created_at"
            );
            if (final_cond == " where ") {
                final_cond = final_cond + date_condition_str;
            } else {
                final_cond = final_cond + " and " + date_condition_str;
            }
        }

        if (Object.keys(search).length) {
            let date_like_search_str =
                await helpers.get_conditional_or_like_string(search);
            if (final_cond == " where ") {
                final_cond = final_cond + date_like_search_str;
            } else {
                final_cond = final_cond + " and " + date_like_search_str;
            }
        }

        if (final_cond == " where ") {
            final_cond = "";
        }

        let query;
        if (Object.keys(limit).length) {
            query =
                "select * from " +
                dbtable +
                final_cond +
                " ORDER BY id DESC LIMIT " +
                limit.perpage +
                " OFFSET " +
                limit.start;
        } else {
            query =
                "select * from " + dbtable + final_cond + " ORDER BY id DESC";
        }

        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response;
    },

    applied_select_list: async (condition, date_condition, limit) => {
        let qb = await pool.get_connection();
        let final_cond = " where ";

        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }

        if (Object.keys(date_condition).length) {
            let date_condition_str = await helpers.get_date_between_condition(
                date_condition.from_date,
                date_condition.to_date,
                "created_at"
            );
            if (final_cond == " where ") {
                final_cond = final_cond + date_condition_str;
            } else {
                final_cond = final_cond + " and " + date_condition_str;
            }
        }

        if (final_cond == " where ") {
            final_cond = "";
        }

        let query;
        if (Object.keys(limit).length) {
            query =
                "select * from " +
                dbtable2 +
                final_cond +
                " ORDER BY id DESC LIMIT " +
                limit.perpage +
                " OFFSET " +
                limit.start;
        } else {
            query =
                "select * from " + dbtable2 + final_cond + " ORDER BY id DESC";
        }

        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response;
    },

    select_review_list: async (limit) => {
        let qb = await pool.get_connection();
        let response;
        if (limit.perpage) {
            response = await qb
                .select("*")
                .order_by("id", "desc")
                .limit(limit.perpage, limit.start)
                .get(review_table);
            qb.release();
        } else {
            response = await qb
                .select("*")
                .order_by("id", "desc")
                .get(review_table);
            qb.release();
        }
        return response;
    },

    get_count: async (condition, date_condition, search) => {
        let qb = await pool.get_connection();
        let final_cond = " where ";

        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }

        if (Object.keys(date_condition).length) {
            let date_condition_str = await helpers.get_date_between_condition(
                date_condition.from_date,
                date_condition.to_date,
                "created_at"
            );
            if (final_cond == " where ") {
                final_cond = final_cond + date_condition_str;
            } else {
                final_cond = final_cond + " and " + date_condition_str;
            }
        }

        if (Object.keys(search).length) {
            let date_like_search_str =
                await helpers.get_conditional_or_like_string(search);
            if (final_cond == " where ") {
                final_cond = final_cond + date_like_search_str;
            } else {
                final_cond = final_cond + " and " + date_like_search_str;
            }
        }

        if (final_cond == " where ") {
            final_cond = "";
        }

        let query = "select count(*) as total from " + dbtable + final_cond;

        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response[0]?.total;
    },

    get_proposal_count: async (condition) => {
        let qb = await pool.get_connection();
        let final_cond = " where ";

        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }

        if (final_cond == " where ") {
            final_cond = "";
        }

        let query =
            "select count(*) as total from " + `mx_applied_jobs` + final_cond;

        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response[0]?.total;
    },

    applied_get_count: async (condition, date_condition) => {
        let qb = await pool.get_connection();
        let final_cond = " where ";

        if (Object.keys(condition).length) {
            let condition_str = await helpers.get_and_conditional_string(
                condition
            );
            if (final_cond == " where ") {
                final_cond = final_cond + condition_str;
            } else {
                final_cond = final_cond + " and " + condition_str;
            }
        }

        if (Object.keys(date_condition).length) {
            let date_condition_str = await helpers.get_date_between_condition(
                date_condition.from_date,
                date_condition.to_date,
                "created_at"
            );
            if (final_cond == " where ") {
                final_cond = final_cond + date_condition_str;
            } else {
                final_cond = final_cond + " and " + date_condition_str;
            }
        }

        if (final_cond == " where ") {
            final_cond = "";
        }

        let query = "select count(*) as total from " + dbtable2 + final_cond;

        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response[0]?.total;
    },

    selectSpecific: async (selection, condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select(selection)
            .where(condition)
            .get(dbtable2);
        qb.release();
        return response;
    },

    updateDetails: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable);
        qb.release();
        return response;
    },

    updateDetails2: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable2);
        qb.release();
        return response;
    },

    updateProfile: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb
            .set(data)
            .where(condition)
            .update(profile_table);
        qb.release();
        return response;
    },
};

module.exports = dbModel;
