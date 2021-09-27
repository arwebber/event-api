CREATE TABLE `s4ofvm3lvcnodbsy`.`CART` (
  `cart_id` INT NOT NULL AUTO_INCREMENT,
  `session_id` VARCHAR(255) NOT NULL,
  `date_created` DATETIME NOT NULL DEFAULT(NOW()),
  PRIMARY KEY (`cart_id`));