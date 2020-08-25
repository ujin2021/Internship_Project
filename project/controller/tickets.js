require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

exports.useTicket = async(req, res) => {
    const conn = await res.pool.getConnection()
    try {
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        
        if(jwtResult){
            const ticket_no = req.body['ticket_no']
            const user_no = jwtResult.user_no
            const ticket_used_at = new Date()
    
            const sel_result = await conn.query(`SELECT user_ticket_no, ticket_quantity FROM USER_TICKETS WHERE ticket_no = ? AND user_no = ?;`, [ticket_no, user_no])
            console.log(sel_result[0][0]['user_ticket_no'])
            await conn.beginTransaction()
            const log_result = await conn.query(`INSERT INTO LOG_USE_TICKETS (user_ticket_no, ticket_used_at) VALUES (?, ?);`, [sel_result[0][0]['user_ticket_no'], ticket_used_at])
            const log_sel_result = await conn.query(`SELECT * FROM LOG_USE_TICKETS WHERE user_ticket_no = ?;`, sel_result[0][0]['user_ticket_no'])
            if (log_sel_result[0].length === sel_result[0][0]['ticket_quantity']) {
                const upd_result = await conn.query(`UPDATE USER_TICKETS SET user_ticket_enable = 0 WHERE user_ticket_no = ?;`, sel_result[0][0]['user_ticket_no'])
            }
            await conn.commit()
            res.status(200).json({'status' : 200, 'msg' : `티켓 사용이 완료되었습니다.`})
        } else {
            res.status(401).json({'status' : 401, 'msg' : `로그인이 필요한 서비스 입니다.`})
        }
    } catch (e) {
        console.error(e)
        conn.rollback()
        res.status(503).json(e)
    } finally {
        conn.release()
    }
}


module.exports = exports