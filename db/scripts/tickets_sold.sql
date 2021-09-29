CREATE TABLE `s4ofvm3lvcnodbsy`.`TICKETS_SOLD` (
  `tickets_sold_id` INT NOT NULL AUTO_INCREMENT,
  `event_session_id` INT,
  `quantity` INT NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `date_created` DATETIME NOT NULL DEFAULT(NOW()),
  PRIMARY KEY (`tickets_sold_id`),
  FOREIGN KEY (`event_session_id`) REFERENCES EVENT_SESSION(`event_session_id`));