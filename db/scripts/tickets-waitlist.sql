CREATE TABLE `s4ofvm3lvcnodbsy`.`TICKETS_WAITLIST` (
  `waitlist_id` INT NOT NULL AUTO_INCREMENT,
  `event_session_id` INT,
  `quantity` INT NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `date_created` DATETIME NOT NULL DEFAULT(NOW()),
  PRIMARY KEY (`waitlist_id`),
  FOREIGN KEY (`event_session_id`) REFERENCES EVENT_SESSION(`event_session_id`));