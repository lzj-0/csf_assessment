package vttp.batch5.csf.assessment.server.services;

import java.io.StringReader;
import java.sql.Date;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.batch5.csf.assessment.server.repositories.OrdersRepository;
import vttp.batch5.csf.assessment.server.repositories.RestaurantRepository;

@Service
public class RestaurantService {

  @Autowired
  OrdersRepository ordersRepository;

  @Autowired
  RestaurantRepository restaurantRepository;

  RestTemplate template = new RestTemplate();

  // TODO: Task 2.2
  // You may change the method's signature
  public JsonArray getMenu() {
    List<Document> menusDoc = ordersRepository.getMenu();
    JsonArrayBuilder jab = Json.createArrayBuilder();

    menusDoc.forEach(doc -> jab.add(Json.createReader(new StringReader(doc.toJson())).readObject()));

    return jab.build();

  }

  
  // TODO: Task 4
  
  public void validateUser(String username, String password) throws SQLException {
    restaurantRepository.validateUser(username, password);
  }


  public String placeOrder(String username, Float total) {
    String orderId = UUID.randomUUID().toString().substring(0, 8);

    // System.out.println(total);

    JsonObject payload = Json.createObjectBuilder()
                              .add("order_id", orderId)
                              .add("payer", username)
                              .add("payee", "Lee Zi Jie")
                              .add("payment", total)
                              .build();


    String baseUrl = "https://payment-service-production-a75a.up.railway.app";

    String url = baseUrl + "/api/payment";

    RequestEntity<String> req = RequestEntity
                                .post(url)
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .header("X-Authenticate", username)
                                .body(payload.toString(), String.class);

    ResponseEntity<String> resp = template.exchange(req, String.class);

    System.out.println(resp.getStatusCode());

    System.out.println(resp.getBody());

    return resp.getBody();
                              

  }

  @Transactional
  public boolean addOrderDetails(String receipt, String username, Float total, JsonArray itemsArr) {
    JsonObject jObj = Json.createReader(new StringReader(receipt)).readObject();

    String paymentId = jObj.getString("payment_id");
    String orderId = jObj.getString("order_id");
    Long timestamp = jObj.getJsonNumber("timestamp").longValue();

    boolean addedSQL = restaurantRepository.addOrderDetails(orderId, paymentId, new Date(timestamp), total, username);

    if (!addedSQL) {
      throw new RuntimeException("Fail to add to SQL");
    }

    JsonObject toInsert = Json.createObjectBuilder()
                              .add("_id", orderId)
                              .add("order_id", orderId)
                              .add("payment_id", paymentId)
                              .add("username", username)
                              .add("total", total)
                              .add("timestamp", new Date(timestamp).toString())
                              .add("items", itemsArr)
                              .build();

    boolean addedMongo = ordersRepository.addOrderDetails(Document.parse(toInsert.toString()));

    return addedSQL && addedMongo;

  }

}
