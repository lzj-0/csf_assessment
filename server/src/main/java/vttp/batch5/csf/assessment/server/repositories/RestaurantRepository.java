package vttp.batch5.csf.assessment.server.repositories;

import java.sql.Date;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

// Use the following class for MySQL database
@Repository
public class RestaurantRepository {

    public static String SQL_VALIDATE_USER = "select * from customers where username = ? and password = sha2(?, 224)";
    public static String SQL_INSERT_ORDER = "insert into place_orders values (?, ?, ?, ?, ?)";

    @Autowired
    JdbcTemplate template;



    public void validateUser(String username, String password) throws SQLException {
        SqlRowSet rs = template.queryForRowSet(SQL_VALIDATE_USER, username, password);

        if (!rs.next()) {
            throw new SQLException("User not found");
        }

    }

    public boolean addOrderDetails(String orderId, String paymentId, Date date, Float total, String username) {
        return template.update(SQL_INSERT_ORDER, orderId, paymentId, date, total, username) > 0;
    }

    

    
}
