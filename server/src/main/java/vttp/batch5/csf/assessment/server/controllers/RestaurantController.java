package vttp.batch5.csf.assessment.server.controllers;

import java.io.StringReader;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import vttp.batch5.csf.assessment.server.services.RestaurantService;

@RestController
@RequestMapping(path = "/api" , produces = MediaType.APPLICATION_JSON_VALUE)
public class RestaurantController {

  @Autowired
  RestaurantService restaurantService;

  // TODO: Task 2.2
  // You may change the method's signature
  @GetMapping("/menu")
  public ResponseEntity<String> getMenus() {
    JsonArray menu = restaurantService.getMenu();


    return ResponseEntity.ok(menu.toString());
  }

  // TODO: Task 4
  // Do not change the method's signature
  @PostMapping("/food_order")
  public ResponseEntity<String> postFoodOrder(@RequestBody String payload) throws NoSuchAlgorithmException {

    JsonObject jObj = Json.createReader(new StringReader(payload)).readObject();
    String username = jObj.getString("username");
    String password = jObj.getString("password");
    JsonArray itemsArr = jObj.getJsonArray("items");

    Float total = 0.00f;

    for (JsonValue itemVal : itemsArr) {
      JsonObject jItem = itemVal.asJsonObject();
      total = total + jItem.getJsonNumber("quantity").longValue() * jItem.getJsonNumber("price").bigDecimalValue().floatValue();
    }

    try {
      restaurantService.validateUser(username, password);

      String receipt = restaurantService.placeOrder(username, total);

      boolean added = restaurantService.addOrderDetails(receipt, username, total, itemsArr);

      if (!added) {
        throw new Exception("Error uploading data to database");
      }

      JsonObject rawReceipt = Json.createReader(new StringReader(receipt)).readObject();

      JsonObject finalPayload = Json.createObjectBuilder()
                                    .add("orderId", rawReceipt.getString("order_id"))
                                    .add("paymentId", rawReceipt.getString("payment_id"))
                                    .add("timestamp", rawReceipt.getJsonNumber("timestamp").longValue())
                                    .add("total", rawReceipt.getJsonNumber("total").bigDecimalValue().floatValue())
                                    .build();

      return ResponseEntity.ok(finalPayload.toString());
    } catch(SQLException e) {
      e.printStackTrace();

      return ResponseEntity.status(401).body(Json.createObjectBuilder()
                  .add("message", "Invalid username and/or password")
                  .build()
                  .toString());

    } catch(Exception ex) {
      ex.printStackTrace();
      return ResponseEntity.status(500).body(Json.createObjectBuilder()
      .add("message", ex.getMessage())
      .build()
      .toString());
    }

  }
}
