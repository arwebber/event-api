CREATE TABLE `s4ofvm3lvcnodbsy`.`EVENT` (
  `event_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  `start_date_time` DATETIME NOT NULL,
  `end_date_time` DATETIME NOT NULL,
  `banner_image` VARCHAR(500) NULL,
  PRIMARY KEY (`event_id`));
