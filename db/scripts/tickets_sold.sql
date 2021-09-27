CREATE TABLE `s4ofvm3lvcnodbsy`.`TICKETS_SOLD` (
  `tickets_sold_id` INT NOT NULL AUTO_INCREMENT,
  `event_session_id` INT,
  `quantity` INT NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `timestamp` DATETIME,
  PRIMARY KEY (`tickets_sold_id`),
  FOREIGN KEY (`event_session_id`) REFERENCES EVENT_SESSION(`event_session_id`));
  
