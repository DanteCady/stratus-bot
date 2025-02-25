-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: stratusbot
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `proxies`
--

DROP TABLE IF EXISTS `proxies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proxies` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `proxy_group` varchar(100) DEFAULT 'default',
  `address` varchar(255) NOT NULL,
  `status` enum('untested','working','bad') DEFAULT 'untested',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `proxies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proxies`
--

LOCK TABLES `proxies` WRITE;
/*!40000 ALTER TABLE `proxies` DISABLE KEYS */;
/*!40000 ALTER TABLE `proxies` ENABLE KEYS */;
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
INSERT INTO `task_groups` VALUES ('15a09c10-1e21-4f9c-89e1-f957af66418c','292444939412045825','Test 1','2025-02-24 23:00:19'),('20767838-9fb7-4737-8ba5-92c02cc15649','292444939412045825','Test 1 (Copy)','2025-02-25 04:13:35'),('ab2bb172-d8cb-4fb5-8c40-c276c8d31ac5','292444939412045825','Default','2025-02-24 16:53:14');
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
INSERT INTO `users` VALUES ('c4222515-7646-4be5-a3f7-de0dc8e42370','dantecady@gmail.com','2025-02-23 20:33:03','discord','292444939412045825',0);
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

-- Dump completed on 2025-02-24 23:15:06
