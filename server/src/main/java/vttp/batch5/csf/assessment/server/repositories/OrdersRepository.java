package vttp.batch5.csf.assessment.server.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import org.bson.Document;

import java.util.List;


@Repository
public class OrdersRepository {

  @Autowired
  MongoTemplate template;

  private String COLLECTION_MENU = "menus";

  // TODO: Task 2.2
  // You may change the method's signature
  // Write the native MongoDB query in the comment below
  //
  //  Native MongoDB query here
  // db.menus.find().sort({ name : 1})
  //
  public List<Document> getMenu() {
    Query query = new Query().with(Sort.by(Direction.ASC, "name"));
    return template.find(query, Document.class, COLLECTION_MENU);
  }

  
  // TODO: Task 4
  // Write the native MongoDB query for your access methods in the comment below
  //
  //  Native MongoDB query here
  // db.orders.insert({
  //    _id: <orderId>,
  //    order_id: <orderId>,
  //    payment_id: <paymentId>,
  //    username: <username>,
  //    total: <total>,
  //    timestamp: <timestamp>,
  //    items : [
  //       {...},
  //        ...
  //      ]
  // })
  //
  public boolean addOrderDetails(Document document) {
    Document newDoc = template.insert(document, "orders");
    return !newDoc.isEmpty();
  }
  
}
