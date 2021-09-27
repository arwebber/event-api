CREATE TABLE `s4ofvm3lvcnodbsy`.`EVENT_SESSION` (
  `event_session_id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT,
  `description` VARCHAR(255) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `type` VARCHAR(12) NOT NULL,
  `price` FLOAT NOT NULL,
  `sale` TINYINT NOT NULL,
  `sale_end_date_time` DATETIME,
  `total_quantity` INT NOT NULL,
  PRIMARY KEY (`event_session_id`),
  FOREIGN KEY (`event_id`) REFERENCES EVENT(`event_id`));
  
