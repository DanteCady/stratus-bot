-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: stratusbot
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `site_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `proxy` varchar(255) DEFAULT NULL,
  `status` enum('unchecked','working','banned') DEFAULT 'unchecked',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `site_id` (`site_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `accounts_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nike_modes`
--

DROP TABLE IF EXISTS `nike_modes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nike_modes` (
  `id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nike_modes`
--

LOCK TABLES `nike_modes` WRITE;
/*!40000 ALTER TABLE `nike_modes` DISABLE KEYS */;
INSERT INTO `nike_modes` VALUES ('d2bcfdbe-f1fe-11ef-a4f8-d8bbc191788f','Check Entry'),('d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','Draw (Browser)'),('d2bcebb2-f1fe-11ef-a4f8-d8bbc191788f','Draw (Requests)'),('d2bcfcaa-f1fe-11ef-a4f8-d8bbc191788f','FLOW'),('d2bcfe66-f1fe-11ef-a4f8-d8bbc191788f','Refresh Session');
/*!40000 ALTER TABLE `nike_modes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_groups`
--

DROP TABLE IF EXISTS `profile_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_groups` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_groups`
--

LOCK TABLES `profile_groups` WRITE;
/*!40000 ALTER TABLE `profile_groups` DISABLE KEYS */;
INSERT INTO `profile_groups` VALUES ('0d043745-fbf6-4e89-8bd6-cb7e081db5dd','292444939412045825','Test 1 (Copy)',0,'2025-02-27 20:39:18'),('39812e8b-2a24-410f-90f7-8ff6d8a3e525','22f3b047-9b4f-48a9-9621-7ba86611b678','Default',1,'2025-02-27 21:40:24'),('4e1a921b-fcfb-4e21-8403-3305f167132c','292444939412045825','Default',1,'2025-02-26 03:29:16'),('603396a2-e4a0-4042-aa2d-7f708fff433e','292444939412045825','Test 1',0,'2025-02-26 03:35:27');
/*!40000 ALTER TABLE `profile_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) NOT NULL,
  `profile_group_id` varchar(36) NOT NULL,
  `profile_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `address2` text,
  `country` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zipcode` varchar(20) DEFAULT NULL,
  `cardholder` varchar(255) DEFAULT NULL,
  `card_number` varchar(255) DEFAULT NULL,
  `exp_month` varchar(2) DEFAULT NULL,
  `exp_year` varchar(4) DEFAULT NULL,
  `cvv` varchar(4) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `profile_group_id` (`profile_group_id`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`profile_group_id`) REFERENCES `profile_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES ('d22719ad-a7d4-4b0a-8171-23f9fcc81147','292444939412045825','4e1a921b-fcfb-4e21-8403-3305f167132c','Test 1','Dante','Cady','dantecady@gmail.com','4015481179','36 Sylvan ave',NULL,'USA','NY','Cranston','02905','Dante cady','3764558645946','02','2024',NULL,'2025-02-27 20:49:00');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proxies`
--

DROP TABLE IF EXISTS `proxies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proxies` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `proxy_group_id` varchar(36) NOT NULL,
  `address` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'Untested',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `proxy_group_id` (`proxy_group_id`),
  CONSTRAINT `proxies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`provider_id`) ON DELETE CASCADE,
  CONSTRAINT `proxies_ibfk_2` FOREIGN KEY (`proxy_group_id`) REFERENCES `proxy_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proxies`
--

LOCK TABLES `proxies` WRITE;
/*!40000 ALTER TABLE `proxies` DISABLE KEYS */;
INSERT INTO `proxies` VALUES ('00859b2f-2a14-44bd-aec8-5bafdf2134e3','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:11345:969b41fe8697781dfdccadcb2f15a5f78427b8a38d89-m9qq0a23k4:8e55da38fef424a68de8','Untested','2025-02-27 21:50:23'),('029282a9-a8aa-42a3-9d6a-89cafbf65b97','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:13511:08fe38c80a8ced02104c2f203280be7bb25edd3d13ec-m9qq0a23k4:102c56ad157a30bdbb8d','Untested','2025-02-27 21:50:23'),('02b97f51-3038-4279-99c3-8c8011c19fd2','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g1.wolveproxy.com:10251:1aadbd85be4fadc9862846b6f9c87ccfffdb8e2f01bf-m9qq0a23k4:02a9e2e58011fc7ef6de','Untested','2025-02-27 21:51:27'),('03bc17a4-29a1-439f-bb59-132ea7cd4ec7','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:13511:5dc3892ee01c283204bdd23407432e9154efe06846d1-m9qq0a23k4:459dbc6e0085032d5db0','Untested','2025-02-27 21:50:23'),('057568e4-d739-481e-a02d-a07f06544d4a','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:12338:aed53dd604e25ebfa50863818e37812aaa04fcd7-m9qq0a23k4:b629581aac308cd0a5a6','Untested','2025-02-27 21:50:23'),('0600f851-aa90-4a1e-9ebb-0a734499b740','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g4.wolveproxy.com:10251:1bab0977d3874e5d423a5371703baaed1d79c16d0f-m9qq0a23k4:031d8f0b44036fb404d8','Untested','2025-02-27 21:51:27'),('0845ffe2-a9ae-42be-937c-4e8643bb8be3','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:10251:d9b016d56a1c708b47086176b81b2f1baf7093ecc2a2-m9qq0a23k4:c10236364738bf2da6c3','Untested','2025-02-27 21:50:23'),('0c3e8ba8-9959-4630-9f96-72c09be38cbb','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:12338:0105790fdeb2797fee96fbd4530994e065096f7715-m9qq0a23k4:196d8239eca24c8a7c76','Untested','2025-02-27 21:50:23'),('0ccb13ae-61df-449d-869b-a459cc8afba4','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:11345:64926c0b277246e6eca5c5dfcf345b19611cf81270-m9qq0a23k4:7c787b04ea90d04578e1','Untested','2025-02-27 21:50:23'),('0e6eb516-6b8a-4e9d-807f-dcab9e6170b5','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:12338:7e9edcfdc9fa70a533ff960b8204d1f797acf4086a-m9qq0a23k4:66c895353acf9dcf8eed','Untested','2025-02-27 21:50:23'),('0faef533-f435-49e8-93e3-aeedd66722c5','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g1.wolveproxy.com:12338:320f4ff14dd496cb07086a33f9f3e73c8b292c07291d-m9qq0a23k4:2a5b11de013afae5827c','Untested','2025-02-27 21:51:27'),('11f8cc63-32a1-482f-a138-58c348079d06','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:10251:4b7104f9f630ac7212325b2654da1ac893741b3d5f-m9qq0a23k4:5310aaea16024b048a02','Untested','2025-02-27 21:50:23'),('1273803b-41fa-4401-b415-54f9af207ca8','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:11345:2f736bdcdea555d11952322de33197afa60d501a3461-m9qq0a23k4:377f821c1b6ae094af00','Untested','2025-02-27 21:50:23'),('133cb7db-8992-44f8-8801-a51d008815f2','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g4.wolveproxy.com:15029:6b9541d3f0b1487d43d8b87a4b238381a927b65e7087-m9qq0a23k4:7355ac0e4be94b80a0e6','Untested','2025-02-27 21:51:27'),('13f3ca4c-0dc2-42a2-8d2e-a7d4a99001ec','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g2.wolveproxy.com:13511:9941475609f286bd4b4d267a8ceac0782c2162ac8253-m9qq0a23k4:815355c748758ac32532','Untested','2025-02-27 21:51:27'),('141d0b5e-2268-49e8-8713-136dd4eb700e','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:10251:d05fd3579a1ed052e1d7b1d660b82deb2db57ce5cb4d-m9qq0a23k4:c8c7c695e0e46a2f242c','Untested','2025-02-27 21:50:23'),('1ade57a6-6620-44ab-a423-39e7992da861','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:12338:f0cc29c45189e92f87fa9eb6019fae6fae59a686e4-m9qq0a23k4:e83d0daf85cf1eb0b7bf','Untested','2025-02-27 21:50:23'),('201d7187-2a9f-4d53-a1a3-c4e8893ba009','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:12338:8d7fa938eb9be085fc9dfccbae9ab2d552d915fb99-m9qq0a23k4:95bdb7a8fca8b1ac4b0c','Untested','2025-02-27 21:50:23'),('21b16f77-7775-4c88-b20f-6a8e6455c5f4','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g1.wolveproxy.com:11345:2f736bdcdea555d11952322de33197afa60d501a3461-m9qq0a23k4:377f821c1b6ae094af00','Untested','2025-02-27 21:51:27'),('22ac1178-4826-4b4b-8780-668519dc86a8','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:12338:133757c7ff576c4aceec8cf57909658ebd3114260825-m9qq0a23k4:0b43a324ccd97266b444','Untested','2025-02-27 21:50:23'),('24db5e36-9db7-4129-abff-8eb2b1ea5468','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g1.wolveproxy.com:10251:7f33b1bc26c0c9158d7c1eb833b9e618d6c159096b-m9qq0a23k4:67a57a888d4d2cf8cf40','Untested','2025-02-27 21:51:27'),('25faed53-7992-4d53-b241-b4cf551810b9','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:12338:320f4ff14dd496cb07086a33f9f3e73c8b292c07291d-m9qq0a23k4:2a5b11de013afae5827c','Untested','2025-02-27 21:50:23'),('260b9f84-32df-4a15-ae8d-b3578d694144','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:10251:1aadbd85be4fadc9862846b6f9c87ccfffdb8e2f01bf-m9qq0a23k4:02a9e2e58011fc7ef6de','Untested','2025-02-27 21:50:23'),('2a5d916f-46de-47f2-8500-e8d81747588a','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g3.wolveproxy.com:15029:9904d5439a771a68a4432198436b5aa429a56eef8d-m9qq0a23k4:81c1c65aa0705c443077','Untested','2025-02-27 21:51:27'),('2a7a5c8a-f01b-4e99-8677-1051c59d8fe7','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:12338:92ba772d73b4e4a90e94f43f829e9d4d4707d0e486-m9qq0a23k4:8a632fac0aad9d835ec9','Untested','2025-02-27 21:50:23'),('2be96505-4b98-4fe1-a792-e9b4199a684a','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:11345:3a11d00851b8a66616e4862c48d1956f62a07b4c2e-m9qq0a23k4:22c40de01fd3578b7b62','Untested','2025-02-27 21:50:23'),('2d974e63-011c-4323-af8b-ac0c0bb027ac','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:12338:1f48a7c2152b3d1857e8886e36490d2ba8d722690b-m9qq0a23k4:07b3497b5ed82913b13b','Untested','2025-02-27 21:50:23'),('2e4a360e-b0f2-45fd-a6e0-c18fac06edba','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:11345:56ef8249ef955554d13d54e67d27bed123f2852042-m9qq0a23k4:4e96b315d00562a03a9c','Untested','2025-02-27 21:50:23'),('2e953293-3433-4608-b29d-95e64964bc0b','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:10251:2f904c9eb4a2aedacc8fecf9efc691c5e42ab31a3482-m9qq0a23k4:3758e8ebcbbfea93ede3','Untested','2025-02-27 21:50:23'),('33374796-4752-421f-8bf6-75ad3d293042','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g3.wolveproxy.com:12338:f0cc29c45189e92f87fa9eb6019fae6fae59a686e4-m9qq0a23k4:e83d0daf85cf1eb0b7bf','Untested','2025-02-27 21:51:27'),('33555ca9-74ac-4581-828e-2896ecaf0fce','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g1.wolveproxy.com:15029:114cfa8b0ad7f5ae58ccae6b8682ff34e18a266705-m9qq0a23k4:09ee56b259fc99e1f83f','Untested','2025-02-27 21:51:27'),('3392eeb9-7d6d-4a87-a88c-63d431408e25','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:11345:dc6813166c2e8cb26c66065e94f801527c6302aac8-m9qq0a23k4:c40730c869538b1f651b','Untested','2025-02-27 21:50:23'),('342dcdf5-7dd1-451c-a30e-50d353a39def','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:10251:0df757a839d143dee85e3bd2f831fe07c2279d7b19-m9qq0a23k4:15436503e169e7e0db84','Untested','2025-02-27 21:50:23'),('35cab887-a51e-4eee-b781-0aa255a8e0f8','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:15029:98224405148b760538d3bf0a3e13bb657f2201ad8330-m9qq0a23k4:8050483e39eb35ba7651','Untested','2025-02-27 21:50:23'),('35d956c0-198c-4239-95aa-6995753b669b','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g4.wolveproxy.com:10251:b08a9fa45a3d42ac62d0ba5787371064ceefe0c6a4-m9qq0a23k4:a88b060664e8980ed7f9','Untested','2025-02-27 21:51:27'),('36acc156-b147-4792-92f5-a79172ffee2a','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:15029:a331bfea9d6658b49ab4d3aa982149a380cf5bd5b7-m9qq0a23k4:bbabc1109b8487579942','Untested','2025-02-27 21:50:23'),('390a919d-fe12-432a-b5fb-95e767987bbd','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g2.wolveproxy.com:11345:2d3ec900eefae1fb63284f52d693d5d06ab9545b39-m9qq0a23k4:35ddb2a36319c9cb734d','Untested','2025-02-27 21:51:27'),('39929782-a96f-4498-9bd6-f722f7f80e58','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:10251:6b14bc3faac386dfc884e6fef0fcea9455cc7e1d7f-m9qq0a23k4:73a8f6cecdb4eff44c67','Untested','2025-02-27 21:50:23'),('3b6c3790-4b3e-4cf6-b8d3-6975f34ae5b1','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:12338:2c636b985241359d2fadc91eb7436d6cf21b095a38-m9qq0a23k4:347f0e72269ca873eb10','Untested','2025-02-27 21:50:23'),('3cf2bd56-369c-4089-aa0e-ec1ba6916391','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:10251:d87293ac7418cf164a97f27630bf304ac6e318aecc-m9qq0a23k4:c087288d43a62f2edf01','Untested','2025-02-27 21:50:23'),('3e8423c1-049b-4d90-b9f9-0f29567222cb','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g3.wolveproxy.com:15029:4d45c00e60c36ce6125a342dc01be55e64b02f3b59-m9qq0a23k4:55d43c2a1a6cdffb7d36','Untested','2025-02-27 21:51:27'),('4056ceb8-ab88-4b84-97ea-a9b075ed1fa3','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:13511:1cc2cd969f5da0a79e82e7aa80d372a1fcbda86a08-m9qq0a23k4:04d9c3e39bb59f6ce5b1','Untested','2025-02-27 21:50:23'),('441b998e-5a04-4df3-8f5d-1e54920496a3','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:10251:30711746e2e4a5c88d92f8b3feccd7933c7152052b63-m9qq0a23k4:2803bee18ba1fcd53502','Untested','2025-02-27 21:50:23'),('47eae474-43fe-4d0b-87fb-227faf209629','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:13511:bce00243197c928ad5e784e7a4e2512729728acaa8-m9qq0a23k4:a41645d2d3d7bb4f3093','Untested','2025-02-27 21:50:23'),('49ccc878-281d-4894-9af1-65acc2930e35','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:11345:7099e0a45416e15f5982e2666e882425de86ba456b8b-m9qq0a23k4:68f408a55fb36c27d7ea','Untested','2025-02-27 21:50:23'),('4b7e92c5-d46d-4974-a9c3-05de7500ba81','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:15029:164101fe851635615eb0d067484430bb94712b6002-m9qq0a23k4:0e15d9755784572e8d32','Untested','2025-02-27 21:50:23'),('50746ac0-319b-489b-b49b-3bb185f450ef','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:13511:9941475609f286bd4b4d267a8ceac0782c2162ac8253-m9qq0a23k4:815355c748758ac32532','Untested','2025-02-27 21:50:23'),('52d6191b-d438-49de-8605-220aed96eeae','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:13511:da7958ae45a39c118fe784bf3ce98e7bc42813acce-m9qq0a23k4:c24c19d987d12390dd0a','Untested','2025-02-27 21:50:23'),('534d8fe7-1a57-4ca5-b781-8e892ae07637','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:15029:af934434c73108fbab5d3d98cc6d03b64e22b09ab481-m9qq0a23k4:b7509b40a86aca0047e0','Untested','2025-02-27 21:50:23'),('592ff15e-2f10-4d70-a0a7-eee3c334aeae','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:13511:4136c0364303edc3889ef9beff8833324ca615745a24-m9qq0a23k4:59d41fa58baff4324545','Untested','2025-02-27 21:50:23'),('59a8dad2-0f16-4e70-9bd2-abd7a89630c3','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g2.wolveproxy.com:10251:a9496a5bf0d2e891306b0802ba98f4ce311a23dfbd-m9qq0a23k4:b17eaca9375ea5ea283a','Untested','2025-02-27 21:51:27'),('5a5f65bb-a829-4cc6-ad35-07c4c4577b0e','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:15029:9904d5439a771a68a4432198436b5aa429a56eef8d-m9qq0a23k4:81c1c65aa0705c443077','Untested','2025-02-27 21:50:23'),('5b43382e-f48d-447b-b514-a16677a711fe','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:10251:a9496a5bf0d2e891306b0802ba98f4ce311a23dfbd-m9qq0a23k4:b17eaca9375ea5ea283a','Untested','2025-02-27 21:50:23'),('5cce850b-dda4-45b9-bc33-b68e34a23b4a','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g2.wolveproxy.com:15029:893748570bf4db4e8f3658ba7fb3c47a2d2e14bc9225-m9qq0a23k4:915c579e8b0e7bc52444','Untested','2025-02-27 21:51:27'),('5e699bbe-6d6d-46cc-bcc1-10fdba88baa9','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:11345:222fabd9e2e10c0512b4d4222c7fcadcb3db455436-m9qq0a23k4:3abfbe4e118333d4aa5c','Untested','2025-02-27 21:50:23'),('5f34eb79-64d7-4248-abf1-9b1ebeb33aba','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:10251:fbd8cbd3a068e1782c1277105f98459eb9bbb28def-m9qq0a23k4:e3dffca82427405ba0ab','Untested','2025-02-27 21:50:23'),('61113942-43b0-4ff5-9ae0-9c89a6c3e71c','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:10251:ce52a24ebf6bbcaaf1ef83c18cca428124d238b8da-m9qq0a23k4:d6b6e3fbf4db935c3d21','Untested','2025-02-27 21:50:23'),('6377c3e5-f092-4c3b-a159-43a0d535c9ef','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:15029:6b9541d3f0b1487d43d8b87a4b238381a927b65e7087-m9qq0a23k4:7355ac0e4be94b80a0e6','Untested','2025-02-27 21:50:23'),('63b2be1a-e820-41d8-8bad-a5758eb43cdf','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:13511:af7317900988ed68046c03325780b878ea71509ab461-m9qq0a23k4:b70355ad015b5db9e300','Untested','2025-02-27 21:50:23'),('6a1b5d0b-f67a-4227-b11b-194835aaa5a0','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:13511:c624c71f2e09525aa77a1d936f3b395f65a107f3dd36-m9qq0a23k4:ded37216a34c6c386c57','Untested','2025-02-27 21:50:23'),('6bc073b1-bded-4954-8cd9-4fdec7d9292f','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:13511:d40c7d1dee7620dab73a528ee64b449f671b2fe1cf1e-m9qq0a23k4:cc69b266bf0ae3476e7f','Untested','2025-02-27 21:50:23'),('6dfc350c-29ee-4b19-8c0d-28963ca7d259','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g4.wolveproxy.com:11345:cb2f6f77fdeb28d1e199fed4ff5fcdc31d1f45bddf-m9qq0a23k4:d37ba16fe6abe0d3045c','Untested','2025-02-27 21:51:27'),('7048540b-4c7d-4e1c-8fd1-ca5fe6fc591a','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:10251:faa339cee0a06f116e5133563d1c8cdea449c98cee-m9qq0a23k4:e22dbc2e6f612292bdd0','Untested','2025-02-27 21:50:23'),('731e73de-44c5-48ea-9024-500351f19e92','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g3.wolveproxy.com:12338:fe1d48f3a82af18deb4c2ad3bd981ad9892e3ecbe50f-m9qq0a23k4:e65cf4b5e37bb81b806e','Untested','2025-02-27 21:51:27'),('74e42961-ea18-4e8c-9263-b01d1dd9a147','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:10251:2407e5d642751732c06a0af314625f7cbc956d5230-m9qq0a23k4:3cf11e50c75f0b41a574','Untested','2025-02-27 21:50:23'),('77bb89f4-7091-4123-9518-af0b2745ac8c','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g3.wolveproxy.com:12338:8d7fa938eb9be085fc9dfccbae9ab2d552d915fb99-m9qq0a23k4:95bdb7a8fca8b1ac4b0c','Untested','2025-02-27 21:51:27'),('795146e0-bca7-4adb-91e0-9cddad5b49ba','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:15029:9453b59b53347dca7d264c40fe110722e1d370a18f41-m9qq0a23k4:8ca10f3c7814f805e820','Untested','2025-02-27 21:50:23'),('79c990e5-8290-4f65-b948-5944572d3353','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:15029:0ba10aa1bc17073cb5fe9a8816743d82cb7acb7d1f-m9qq0a23k4:131ee045bcc80923d2d2','Untested','2025-02-27 21:50:23'),('80f9116c-939b-494a-be4d-79234ec30d11','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:11345:3251d79cc60972a27ed8b44b8d0421f8f6a73b4426-m9qq0a23k4:2ac39a3478ed923fef22','Untested','2025-02-27 21:50:23'),('81806567-8403-4de6-b319-75434cb4c7d8','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:11345:ceae45c200f692e372721344cfe7db3ea835c4b8da-m9qq0a23k4:d6515cd5744bd0c5b1dd','Untested','2025-02-27 21:50:23'),('821832e4-1582-44e3-a751-408e4fda25ef','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g2.wolveproxy.com:15029:23cbd2946335e327ee0968da168d0612eeb4e81638d9-m9qq0a23k4:3bc63fa0eb3f1304e7b8','Untested','2025-02-27 21:51:27'),('85ed9a47-552b-4be3-aa4e-fb4536dabdd8','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:12338:fe1d48f3a82af18deb4c2ad3bd981ad9892e3ecbe50f-m9qq0a23k4:e65cf4b5e37bb81b806e','Untested','2025-02-27 21:50:23'),('91290020-75f3-4469-b5f9-e3f4d1be750a','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:10251:6de8b7761d114241d34e24eb693737231cc7821b79-m9qq0a23k4:75a34105d27c7629059b','Untested','2025-02-27 21:50:23'),('9182ed1c-c25c-49a9-ac13-8662894a352a','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:12338:86004fb3a8baee2c31d4ba050b9f9596d93f6af092-m9qq0a23k4:9e5bf4af34ec148bc073','Untested','2025-02-27 21:50:23'),('97c1fefd-23ae-4a63-96d5-733b49fb4464','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:11345:75bb51a974775f583dd5b70b60374705d33798406ea9-m9qq0a23k4:6d45281a3be66b46dac8','Untested','2025-02-27 21:50:23'),('9a74f89b-a5da-40c5-a496-208ae25cca7b','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:11345:cb2f6f77fdeb28d1e199fed4ff5fcdc31d1f45bddf-m9qq0a23k4:d37ba16fe6abe0d3045c','Untested','2025-02-27 21:50:23'),('9b051a1d-8ef2-41f4-9dd3-b4d09e74057b','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:10251:0c377aa89f81ff047e533b412f8aaba1c20a5d7a18-m9qq0a23k4:146ec3ba766a30b5db44','Untested','2025-02-27 21:50:23'),('9e6c736b-1f26-4b5f-a665-1050f53ec1c2','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g2.wolveproxy.com:10251:83da53927979c25d525b376f64ac4908e835f9b698c8-m9qq0a23k4:9b47258156636548e1a9','Untested','2025-02-27 21:51:27'),('a527e915-78ac-40c1-a92f-a99003e88bf2','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:10251:1bab0977d3874e5d423a5371703baaed1d79c16d0f-m9qq0a23k4:031d8f0b44036fb404d8','Untested','2025-02-27 21:50:23'),('a5c4c044-9e87-40f2-b64f-f1a7512d1c6c','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:15029:55396d66fedd02accc0163fb996fef8f1c0b1a604e2b-m9qq0a23k4:4d79a242cf379bec154a','Untested','2025-02-27 21:50:23'),('a91e5159-bcef-4ac5-9c5d-f4680e5dbb01','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:15029:c9c90ac67a712dadcc3d58fa855f5944ac7aa3bfdd-m9qq0a23k4:d11e266dcf0f9a47b5ba','Untested','2025-02-27 21:50:23'),('aa8baa0f-c53e-4c5c-a8e0-715b7e02f6dc','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:12338:818e43f838c363e71f107520da0ff0498225adb49a9c-m9qq0a23k4:995764221821d1f28bfd','Untested','2025-02-27 21:50:23'),('ab92c26c-486c-479c-b17a-ddd09ce61b2d','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:10251:a4bae0542f05db6e82b0d3b05bbf355e2e869991bfa8-m9qq0a23k4:bcf4739284855d3427c9','Untested','2025-02-27 21:50:23'),('acef7cd3-7232-4e94-a9c3-19ed4581cdb6','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g4.wolveproxy.com:10251:a4bae0542f05db6e82b0d3b05bbf355e2e869991bfa8-m9qq0a23k4:bcf4739284855d3427c9','Untested','2025-02-27 21:51:27'),('b2960cec-1ef7-423b-8b12-260048fe11cf','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:13511:eed0b8bf0b1aa85c6e284a5964c52a7ac5def3dbf5c2-m9qq0a23k4:f6ac57e86f1b6f2bcca3','Untested','2025-02-27 21:50:23'),('b46a1ec5-ab3d-4a70-8fcb-f4798a84e583','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:15029:8c1f2e7bf7148c6ac82a41fb41fb3ec9115e75fa98-m9qq0a23k4:943aabc9cf135e20086c','Untested','2025-02-27 21:50:23'),('b5e548e2-9e52-40b0-839f-796a3edac4a8','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g4.wolveproxy.com:11345:3251d79cc60972a27ed8b44b8d0421f8f6a73b4426-m9qq0a23k4:2ac39a3478ed923fef22','Untested','2025-02-27 21:51:27'),('b606fa30-bce1-4d8e-acc9-5208d9ef8a48','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:11345:4c89dee31369e9711d2c492d478d596299b8aa79579b-m9qq0a23k4:54ca4fa01b18445890fa','Untested','2025-02-27 21:50:23'),('b6214699-8084-423e-89d1-f7393434d38a','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:11345:2d3ec900eefae1fb63284f52d693d5d06ab9545b39-m9qq0a23k4:35ddb2a36319c9cb734d','Untested','2025-02-27 21:50:23'),('b832d011-fd92-4c10-822a-7eb19db60516','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:12338:7024f549d8f7ec011751302e3783c7a9339307456b36-m9qq0a23k4:68e184ae166335c63a57','Untested','2025-02-27 21:50:23'),('b8a87e03-77c9-488e-b8ea-f205cb8e5199','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:10251:64b0e3f043604052c5d8bdf66e2953328a8593517fa2-m9qq0a23k4:7cf71f04c0ee645183c3','Untested','2025-02-27 21:50:23'),('b9562305-6b85-4190-984c-8612a82596e3','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g3.wolveproxy.com:15029:55396d66fedd02accc0163fb996fef8f1c0b1a604e2b-m9qq0a23k4:4d79a242cf379bec154a','Untested','2025-02-27 21:51:27'),('b9f7ae42-4053-4c3c-932e-9424c8882c07','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:11345:d345dcf7d1e8cbfa435d3e76c1a7dba08dba66e6c857-m9qq0a23k4:cbc88d8a476bcad98436','Untested','2025-02-27 21:50:23'),('baf00855-219a-478c-b2bf-e815f725a8bf','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:13511:e2e110db90910135093750200464f1bea729c89b-m9qq0a23k4:fa04cc490d0607a0a892','Untested','2025-02-27 21:50:23'),('bb3b0779-3e75-4906-9990-8add0f172306','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:10251:be7f85c594aedeb15c0e6e6b9ca681aaaff515c8aa-m9qq0a23k4:a691c8965a36839fb60c','Untested','2025-02-27 21:50:23'),('bddc1f63-5cd6-44ff-a00a-c42e0f66079e','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:15029:114cfa8b0ad7f5ae58ccae6b8682ff34e18a266705-m9qq0a23k4:09ee56b259fc99e1f83f','Untested','2025-02-27 21:50:23'),('c2b88933-86a0-4703-a4b6-b3f464801b3f','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g1.wolveproxy.com:13511:08fe38c80a8ced02104c2f203280be7bb25edd3d13ec-m9qq0a23k4:102c56ad157a30bdbb8d','Untested','2025-02-27 21:51:27'),('c4e0289a-ade1-46b7-bb8c-77db2b5c6bc3','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:13511:fe65555abcec33468db9d8bf6846c48230250f88ea-m9qq0a23k4:e641e077898b77da2916','Untested','2025-02-27 21:50:23'),('c5bfab6d-3b68-4d3c-b528-1036cda3a803','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:13511:327fb0589ac0d0876ceb8b5fbfbbf2eb22d65c07296d-m9qq0a23k4:2aa4c69668d3b4f12b0c','Untested','2025-02-27 21:50:23'),('c6bfd30d-1b08-491d-95e2-def991246ec0','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:15029:8afa8ce68cbf755ead3a509d661b8cfd9cead9bf91e8-m9qq0a23k4:9298d036aa02668e9589','Untested','2025-02-27 21:50:23'),('c7a69dc1-3db6-4cb6-932e-69e0525acdeb','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:10251:83da53927979c25d525b376f64ac4908e835f9b698c8-m9qq0a23k4:9b47258156636548e1a9','Untested','2025-02-27 21:50:23'),('c963e566-e515-46d8-9415-93afcb80059b','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g1.wolveproxy.com:12338:1f48a7c2152b3d1857e8886e36490d2ba8d722690b-m9qq0a23k4:07b3497b5ed82913b13b','Untested','2025-02-27 21:51:27'),('c9f7fa35-10a4-4669-98a7-837cff8af8e8','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:10251:71f7a3559d87b42b7dddbd441adfb4ec2fc5d4446ae5-m9qq0a23k4:69b7c1f275ef1cb62684','Untested','2025-02-27 21:50:23'),('cb1045eb-d994-4978-9bb9-1a7775def269','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:11345:30361365836eaadf35731c19e7c30ead192a1f49-m9qq0a23k4:2807dfee3444e75f1645','Untested','2025-02-27 21:50:23'),('cb227b55-00f1-4a34-8a54-dc34a0b2c559','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:11345:9ee1fcb714f5deae536106609bb2c565cd9ac2ab85f3-m9qq0a23k4:86e8489f55569dc4c492','Untested','2025-02-27 21:50:23'),('cc631948-268f-44bf-ae62-705348cfabb0','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g3.wolveproxy.com:10251:6de8b7761d114241d34e24eb693737231cc7821b79-m9qq0a23k4:75a34105d27c7629059b','Untested','2025-02-27 21:51:27'),('ccfb637a-4d68-43b2-8309-09a2ec44bbe4','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:15029:23cbd2946335e327ee0968da168d0612eeb4e81638d9-m9qq0a23k4:3bc63fa0eb3f1304e7b8','Untested','2025-02-27 21:50:23'),('ce5f3a14-4588-4ad8-83dc-3e6556c12fc9','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:11345:64e69ea7da035ae6763d5d46c92e2ee4cdee8c1270-m9qq0a23k4:7c8a861f770ed630d495','Untested','2025-02-27 21:50:23'),('cfb92ccd-200e-4ebe-bed6-59067a989b68','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:10251:7f33b1bc26c0c9158d7c1eb833b9e618d6c159096b-m9qq0a23k4:67a57a888d4d2cf8cf40','Untested','2025-02-27 21:50:23'),('d112e8bc-478e-4de4-b25a-bc618a00304e','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:13511:f3d5d66c9023d164a0c7a0914ca60aae06a6bf85e7-m9qq0a23k4:ebc2cc94a6f453141fa6','Untested','2025-02-27 21:50:23'),('d152b062-037e-4b29-9aa9-1e6a2b6db132','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g2.wolveproxy.com:12338:818e43f838c363e71f107520da0ff0498225adb49a9c-m9qq0a23k4:995764221821d1f28bfd','Untested','2025-02-27 21:51:27'),('d181bbb0-18d0-4320-a0b3-b3c3791d6761','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:11345:3ee8bd85aaae11866782eb51af638594efcd82482a-m9qq0a23k4:26a9f65365b2b09bf69b','Untested','2025-02-27 21:50:23'),('d3ba4f50-5f0e-44f4-9bae-5fb3f25c5b06','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:15029:286cf1110cdfddc8d0f398fdf2b9b8226dc84551-m9qq0a23k4:30e55094d0c1f0e9621f','Untested','2025-02-27 21:50:23'),('d7d7d5af-5506-4067-8d54-6d6dc5967d49','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:11345:b3b254430ead3eab55e780629b579f7f39329186a8a0-m9qq0a23k4:ab40527a55d59c9c30c1','Untested','2025-02-27 21:50:23'),('d8158fac-635f-45bc-a95f-d8850b03f090','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:10251:b08a9fa45a3d42ac62d0ba5787371064ceefe0c6a4-m9qq0a23k4:a88b060664e8980ed7f9','Untested','2025-02-27 21:50:23'),('dc2e9d89-2ed5-4cb9-a3fd-e4f13a953bfe','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:12338:cf0d6b88e30875c898395ea9f8103892f20d2efad41f-m9qq0a23k4:d77fbf3d9d08fe39fb7e','Untested','2025-02-27 21:50:23'),('e29f26b7-ab8b-43f9-bd14-6948b77bd4d6','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:13511:16719702628a06f8eadebfd2cb6bb81378f152230d63-m9qq0a23k4:0e833e46eaeacebb7102','Untested','2025-02-27 21:50:23'),('e4909cf6-58cd-4e88-a762-b8d0a78a0522','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:12338:eca24b94ab57db908b1170b8abbe67daee2d81d9f7b0-m9qq0a23k4:f45ff7938b22a066e7d1','Untested','2025-02-27 21:50:23'),('e4dc9a2c-17eb-4be5-982e-c4b909894b35','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g4.wolveproxy.com:11345:4c89dee31369e9711d2c492d478d596299b8aa79579b-m9qq0a23k4:54ca4fa01b18445890fa','Untested','2025-02-27 21:51:27'),('e8e6faf0-d75c-400a-be97-382f9c0ac0b6','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g3.wolveproxy.com:15029:4d45c00e60c36ce6125a342dc01be55e64b02f3b59-m9qq0a23k4:55d43c2a1a6cdffb7d36','Untested','2025-02-27 21:50:23'),('eb123c34-0286-4eee-b103-a721f701aa70','292444939412045825','be602410-8fb7-4328-84da-03ebeb25b0b7','p2-g1.wolveproxy.com:10251:faa339cee0a06f116e5133563d1c8cdea449c98cee-m9qq0a23k4:e22dbc2e6f612292bdd0','Untested','2025-02-27 21:51:27'),('efbb3578-3830-460c-9c5e-d270af0f923d','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g4.wolveproxy.com:11345:9255cca2f7aa5e5ff61a75ca762585c9c8bc3fe486-m9qq0a23k4:8ad8ab17fe2d699bd126','Untested','2025-02-27 21:50:23'),('f5175642-4182-41a9-ad52-f924a19c717e','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g2.wolveproxy.com:15029:893748570bf4db4e8f3658ba7fb3c47a2d2e14bc9225-m9qq0a23k4:915c579e8b0e7bc52444','Untested','2025-02-27 21:50:23'),('f6ac92ef-e6bf-42cb-aeaa-b0f794265efb','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:12338:4dc0199bc17b7b500585e1337e095cfff169aa3b59-m9qq0a23k4:550d9d3804b46142e8b3','Untested','2025-02-27 21:50:23'),('f72cc9d4-2432-4703-ab33-4000558b0d26','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:11345:2e4badfcb852b7dd607d1954f7c0798696dd21583a-m9qq0a23k4:36b9e4f2674ae8678f38','Untested','2025-02-27 21:50:23'),('f81a2ab8-73e4-4c84-aaac-a00be73b6190','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:12338:49c96713d18f9cc867d1b058f3f1bca06901ea7c52db-m9qq0a23k4:51738ddc6fe1f8be60ba','Untested','2025-02-27 21:50:23'),('fe3c29b4-5d6e-43c1-9a50-518eb69ee4be','292444939412045825','63d72c14-7bf3-4245-9772-d3835553037d','p2-g1.wolveproxy.com:11345:c61981a7337db2c1b9056d81e7c2510dcdf173b0d2-m9qq0a23k4:de956ff0b13cf84fd46a','Untested','2025-02-27 21:50:23');
/*!40000 ALTER TABLE `proxies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proxy_groups`
--

DROP TABLE IF EXISTS `proxy_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proxy_groups` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `proxy_groups_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`provider_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proxy_groups`
--

LOCK TABLES `proxy_groups` WRITE;
/*!40000 ALTER TABLE `proxy_groups` DISABLE KEYS */;
INSERT INTO `proxy_groups` VALUES ('63d72c14-7bf3-4245-9772-d3835553037d','292444939412045825','Default',1,'2025-02-27 21:46:40'),('be602410-8fb7-4328-84da-03ebeb25b0b7','292444939412045825','Test 1',0,'2025-02-27 21:50:49');
/*!40000 ALTER TABLE `proxy_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
INSERT INTO `regions` VALUES ('a70a86c2-f19c-11ef-a4f8-d8bbc191788f','United States');
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shops` (
  `id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_enabled` varchar(10) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

LOCK TABLES `shops` WRITE;
/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES ('31286d16-f19c-11ef-a4f8-d8bbc191788f','Nike','true','2025-02-23 04:11:01');
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sites`
--

DROP TABLE IF EXISTS `sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sites` (
  `id` varchar(255) NOT NULL,
  `shop_id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `region_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `shop_id` (`shop_id`),
  KEY `region_id` (`region_id`),
  CONSTRAINT `sites_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sites_ibfk_2` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sites`
--

LOCK TABLES `sites` WRITE;
/*!40000 ALTER TABLE `sites` DISABLE KEYS */;
INSERT INTO `sites` VALUES ('ae7f80a5-f19c-11ef-a4f8-d8bbc191788f','31286d16-f19c-11ef-a4f8-d8bbc191788f','Nike','a70a86c2-f19c-11ef-a4f8-d8bbc191788f','2025-02-23 04:14:31');
/*!40000 ALTER TABLE `sites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `whop_key` varchar(255) NOT NULL,
  `activated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `whop_key` (`whop_key`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_groups`
--

DROP TABLE IF EXISTS `task_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_groups` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_groups`
--

LOCK TABLES `task_groups` WRITE;
/*!40000 ALTER TABLE `task_groups` DISABLE KEYS */;
INSERT INTO `task_groups` VALUES ('15a09c10-1e21-4f9c-89e1-f957af66418c','292444939412045825','Test 1','2025-02-24 23:00:19'),('20767838-9fb7-4737-8ba5-92c02cc15649','292444939412045825','Test 1 (Copy)','2025-02-25 04:13:35'),('3eec4f7b-9a23-495b-b1de-5f120d85a646','292444939412045825','Default','2025-02-27 20:31:09'),('61647560-537d-48da-9f29-0fe038ea1c0f','292444939412045825','Default','2025-02-27 20:27:18'),('621ccd0a-8ca3-497a-99e1-bfe056f4a9ff','292444939412045825','Default','2025-02-27 21:27:44'),('754508b7-259a-4e22-a07f-9b57286cd1df','292444939412045825','Default','2025-02-27 21:46:40'),('76f52d51-8b4e-4eab-a012-8c76ff49ef30','83095b3d-8345-42dd-a886-9917a6a8e642','Default','2025-02-26 02:53:02'),('7828bcb6-391e-4112-8ddb-3dc22143b0bb','292444939412045825','Default','2025-02-26 03:29:16'),('9acc3cac-85b3-4500-8ded-b3dff9632585','292444939412045825','Default','2025-02-27 20:29:00'),('ab2bb172-d8cb-4fb5-8c40-c276c8d31ac5','292444939412045825','Default','2025-02-24 16:53:14'),('ae4daff9-dd5e-41d1-9063-b9c095945f1f','292444939412045825','Default','2025-02-27 21:29:52'),('b2a48169-6df0-4066-8a05-04b43b09bfd2','292444939412045825','Default','2025-02-27 21:33:36'),('b9751007-ff40-4ddd-92d5-2dbcf0203182','292444939412045825','Default','2025-02-27 21:34:44'),('ba300a9c-7aa5-4490-bf90-17deb1ef21c9','292444939412045825','Default','2025-02-27 21:41:33'),('c298db6d-d033-4723-b23f-1cac4341ca9d','292444939412045825','Default','2025-02-27 21:32:02'),('c2be1f9c-855e-4009-9901-aa1b4f2bfe65','22f3b047-9b4f-48a9-9621-7ba86611b678','Default','2025-02-27 21:40:24'),('cb7aa017-1000-457b-95e5-494c33b3bd49','c4222515-7646-4be5-a3f7-de0dc8e42370','Default','2025-02-26 02:30:55'),('dc185ff0-232d-44b0-9e56-af5ac6e4242c','292444939412045825','Default','2025-02-27 21:38:51');
/*!40000 ALTER TABLE `task_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_logs`
--

DROP TABLE IF EXISTS `task_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_logs` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `task_id` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `task_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_logs_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_logs`
--

LOCK TABLES `task_logs` WRITE;
/*!40000 ALTER TABLE `task_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `proxy_id` varchar(255) DEFAULT NULL,
  `site_id` varchar(255) NOT NULL,
  `product` varchar(255) DEFAULT NULL,
  `monitor_delay` int DEFAULT '3500',
  `error_delay` int DEFAULT '3500',
  `mode_id` varchar(255) NOT NULL,
  `status` enum('pending','running','failed','success') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `task_group_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `proxy_id` (`proxy_id`),
  KEY `site_id` (`site_id`),
  KEY `mode_id` (`mode_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('17226bfe-18a9-4d99-b0dd-b21d7a6efe9b','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f','HF3975-001',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:12:43','181240f2-491f-4cdc-856c-5ae83f563aed'),('1f00288f-7e99-4783-b3c8-a9e3ad91e66d','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f','jordan',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:12:43','181240f2-491f-4cdc-856c-5ae83f563aed'),('3b014269-417b-47d4-838e-3e43711c1dd5','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f',' HV8563-600',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:12:43','181240f2-491f-4cdc-856c-5ae83f563aed'),('4f49e8b1-3b50-4800-b848-20626ff0f404','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f','HF3975-001',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:12:35','154ac1b8-d344-4528-bb8c-af558f75fd53'),('551673a9-3ab6-49e6-9cee-0c77514b8bdf','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f','HF3975-001',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:13:35','20767838-9fb7-4737-8ba5-92c02cc15649'),('80f09fdb-7359-4aaa-85bd-d698df868979','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f','jordan',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:12:35','154ac1b8-d344-4528-bb8c-af558f75fd53'),('a27421f3-2f7f-4bee-b0ae-cdddc5f0be54','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f',' HV8563-600',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:01:38','15a09c10-1e21-4f9c-89e1-f957af66418c'),('a82978ff-bb96-461e-b80a-ea0f372d38ce','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f',' HV8563-600',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:12:35','154ac1b8-d344-4528-bb8c-af558f75fd53'),('a8b616c4-5c51-4c67-918e-c7bc3b4af0fc','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f','jordan',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:03:25','15a09c10-1e21-4f9c-89e1-f957af66418c'),('d060c08d-6305-4ef2-91c5-eb8ea52a269f','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f',' HV8563-600',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:13:35','20767838-9fb7-4737-8ba5-92c02cc15649'),('d9604aed-c33e-4f70-aa9d-426cc7de9677','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f','jordan',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 04:13:35','20767838-9fb7-4737-8ba5-92c02cc15649'),('e8c38b44-74c7-4aeb-ad91-a659f492fc33','292444939412045825',NULL,'ae7f80a5-f19c-11ef-a4f8-d8bbc191788f','HF3975-001',3500,3500,'d2bccca1-f1fe-11ef-a4f8-d8bbc191788f','pending','2025-02-25 03:56:10','15a09c10-1e21-4f9c-89e1-f957af66418c');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `provider` varchar(50) NOT NULL,
  `provider_id` varchar(50) NOT NULL,
  `is_first_login` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `provider_id` (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('22f3b047-9b4f-48a9-9621-7ba86611b678','dantecady@gmail.com','2025-02-27 21:40:24','discord','292444939412045825',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-27 16:53:50
