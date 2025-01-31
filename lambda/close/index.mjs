import mysql from 'mysql'
export const handler = async (event) => {
    var pool = mysql.createPool({
        host:'tables4u.cdikygok8rdg.us-east-2.rds.amazonaws.com',
        user: "admin",
        password: "sidewalkslammers",
        database: "tables4u"
    })

    let response = {}

    let isOwner = (username, credential) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM tables4u.restaurants WHERE username=? AND credential=?', [username, credential], (error, rows) => {
                if (error) { return reject(error) }
                if ((rows) && (rows.length == 1)) {
                    return resolve(rows)
                } else {
                    return resolve(false)
                }
            })
        })
    }

    let closeDay = (username, day, month, year) => {
      return new Promise((resolve, reject) => {
        pool.query('INSERT INTO closedDates (day, month, year, username) VALUES (?, ?, ?, ?)', [day, month, year, username], (error, rows) => {
          if (error) {
            if (error["code"] == "ER_DUP_ENTRY") { return reject("Date already closed"); }
            else if (error["errno"] == 3819) { return reject("Invalid date"); }
            else { return reject(error); }
          }
          if (rows) {
            pool.query('SELECT * FROM tables4u.closedDates WHERE username=?', [username], (selectError, selectRows) => {
                if (selectError) { return reject(selectError); }
                resolve(selectRows);
            })
          }
        })
      })
    }

    try {
        const owner = await isOwner(event.username, event.credential);
        if (owner) {
            let result = {}
            const currentDate = new Date();
            const targetDate = new Date(event.year, event.month - 1, event.day);

            if (currentDate < targetDate) {
                result = await closeDay(event.username, event.day, event.month, event.year)
                response.statusCode = 200
                response.dates = result
            } else { 
                response.statusCode = 400
                response.error = "Not a future date"
            }
        } else {
            response.error = "invalid credentials"
            response.statusCode = 400
        }
    } catch (error) {
        response.statusCode = 400
        response.error = error
    }

    pool.end()
    return response;
}