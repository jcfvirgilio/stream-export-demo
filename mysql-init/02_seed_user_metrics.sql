DELIMITER $$
CREATE PROCEDURE seed_user_metrics()
BEGIN
  DECLARE i INT DEFAULT 0;
  WHILE i < 20000 DO
    INSERT INTO user_metrics (name, value) VALUES (CONCAT('user_', i), RAND());
    SET i = i + 1;
  END WHILE;
END$$
DELIMITER ;

CALL seed_user_metrics();
DROP PROCEDURE IF EXISTS seed_user_metrics;
