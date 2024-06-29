import * as db from "$lib/server/database_v2.js";

export async function POST({ request, locals }) {
  try {
    const data = await request.json();
    let columns = [], values = [], types = [];

    for (let i = 0; i < data.filters.length; i++) {
      columns.push(`${data.filters[i].group[0].toLowerCase()}${data.filters[i].group[data.filters[i].group.length - 1].toLowerCase()}.${data.filters[i].key}`);
      values.push(data.filters[i].value);
      types.push(data.filters[i].type);
    }

    const start_index = (data.page - 1) * data.count;
    const sites = await db.get_companies(locals.db_conn, columns, values, types, data.sorting);

    return Response.json({
      data: sites.slice(start_index, start_index + data.count),
      meta: {
        status: 200,
        total: sites.length
      }
    }, { status: 200 });
  } catch (err) {
    return Response.json({
      meta: {
        error: err,
        status: 500
      }
    }, { status: 500 });
  }
}