require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

// 티켓 사용시 티켓사용 log에 insert, 티켓사용 log에서 현재 사용한 티켓을 몇번 사용했는지 select, 만약 가지고 있는 해당티켓의 수와 같으면 ticket_enable을 0으로 update
exports.useTicket = async(req, res) => {
    const conn = await res.pool.getConnection()
    try {
        const jwtResult = req.user
        console.log('jwtDecode result : ', jwtResult)
        
        if(jwtResult){
            const ticket_no = req.params.ticket_no
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
            res.status(200).json({'msg' : `티켓 사용이 완료되었습니다.`})
        } else {
            res.status(401).json({'msg' : `로그인이 필요한 서비스 입니다.`})
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