CREATE TABLE `s4ofvm3lvcnodbsy`.`CART_ITEM` (
  `cart_item_id` INT NOT NULL AUTO_INCREMENT,
  `cart_id` VARCHAR(255),
  `event_session_id` INT,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  FOREIGN KEY (`cart_id`) REFERENCES CART(`cart_id`),
  FOREIGN KEY (`event_session_id`) REFERENCES EVENT_SESSION(`event_session_id`));
