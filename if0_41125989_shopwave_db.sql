-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql100.infinityfree.com
-- Generation Time: Mar 26, 2026 at 12:56 AM
-- Server version: 11.4.10-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_41125989_shopwave_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_audit_log`
--

CREATE TABLE `admin_audit_log` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `selected_color` varchar(100) DEFAULT NULL,
  `selected_size` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `selected_color`, `selected_size`, `created_at`, `updated_at`) VALUES
(103, 23, 23, 7, 'Red', 'XL', '2026-03-20 08:44:51', '2026-03-24 01:21:48'),
(104, 18, 27, 7, 'Red', 'L', '2026-03-22 10:33:27', '2026-03-22 10:35:02');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `parent_id`, `image_url`, `created_at`) VALUES
(1, 'Men', 'haha', NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAYcCUAMBIgACEQEDEQH/', '2026-02-07 11:42:45'),
(2, 'Female', 'babae', NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAYcCUAMBIgACEQEDEQH/', '2026-02-08 08:42:21'),
(3, 'Kids', 'pang bata', NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAYcCUAMBIgACEQEDEQH/', '2026-02-08 08:42:31');

-- --------------------------------------------------------

--
-- Table structure for table `failed_logins`
--

CREATE TABLE `failed_logins` (
  `id` int(11) NOT NULL,
  `username_or_email` varchar(100) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('order','promo','review','alert') NOT NULL DEFAULT 'order',
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `message`, `is_read`, `created_at`) VALUES
(1, 18, 'order', 'Your order #ORD-20260311-E7493653 is now completed. Thank you!', 1, '2026-03-11 13:44:12'),
(2, 18, 'order', 'Your order #ORD-20260309-12B577BD has been delivered. Enjoy!', 1, '2026-03-11 13:44:48'),
(3, 18, 'order', 'Your order #ORD-20260309-12B577BD has been delivered. Enjoy!', 1, '2026-03-11 13:45:58'),
(4, 18, 'order', 'Your order #ORD-20260311-A9B74756 has been cancelled.', 1, '2026-03-11 13:46:19'),
(5, 18, 'order', 'Your order #ORD-20260308-4086C1FD is now completed. Thank you!', 1, '2026-03-11 13:46:37'),
(6, 18, 'order', 'Your order #ORD-20260308-3CB831AB has been cancelled.', 1, '2026-03-11 14:00:08'),
(7, 18, 'order', 'Your order #ORD-20260311-A9B74756 has been cancelled. | hahhaa', 1, '2026-03-11 14:01:12'),
(8, 18, 'order', 'Your order #ORD-20260311-A9B74756 has been cancelled. | hahhaa', 1, '2026-03-11 14:43:03'),
(9, 18, 'order', 'Your order #ORD-20260311-A9B74756 has been cancelled. | HAHAHHAAHHHAHAHAHHAHAHAHA', 1, '2026-03-11 14:43:56'),
(10, 18, 'order', 'Your order #ORD-20260311-57D2E8A2 has been delivered. Enjoy!', 1, '2026-03-11 15:29:56'),
(11, 18, 'order', 'Your order #ORD-20260311-57D2E8A2 has been delivered. Enjoy!', 1, '2026-03-11 16:06:38'),
(12, 18, 'order', 'Your order #ORD-20260311-0B470DCF has been delivered. Enjoy!', 1, '2026-03-11 16:06:43'),
(13, 18, 'order', 'Your order #ORD-20260311-0B470DCF is now being processed. | Still in process, wait for it', 1, '2026-03-11 16:12:51'),
(14, 18, 'order', 'Your order #ORD-20260311-0B470DCF has been delivered. Enjoy!', 1, '2026-03-11 16:25:31'),
(15, 18, 'order', 'Your order #ORD-20260311-0B470DCF is now completed. Thank you!', 1, '2026-03-11 16:26:08'),
(16, 18, 'order', 'Your order #ORD-20260311-0B470DCF has been delivered. Enjoy!', 1, '2026-03-11 16:26:30'),
(17, 18, 'order', 'Your order #ORD-20260311-0B470DCF is pending.', 1, '2026-03-14 08:22:32'),
(18, 18, 'order', 'Your order #ORD-20260311-0B470DCF is pending. | Still in process, wait for it', 1, '2026-03-14 09:14:09'),
(19, 18, 'order', 'Your order #ORD-20260319-D2EF20EB has been cancelled. | Wala na palang stock', 1, '2026-03-19 15:22:27');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(100) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `shipping_fee` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled','completed') DEFAULT 'pending',
  `shipping_name` varchar(100) DEFAULT NULL,
  `shipping_email` varchar(100) DEFAULT NULL,
  `shipping_phone` varchar(20) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `shipping_address` text DEFAULT NULL,
  `shipping_city` varchar(100) DEFAULT NULL,
  `shipping_postal` varchar(20) DEFAULT NULL,
  `shipping_country` varchar(50) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `total_amount`, `subtotal`, `shipping_fee`, `tax_amount`, `status`, `shipping_name`, `shipping_email`, `shipping_phone`, `payment_method`, `payment_status`, `shipping_address`, `shipping_city`, `shipping_postal`, `shipping_country`, `tracking_number`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'ORD-20260207-3DD086C7', 2, '463.28', NULL, NULL, NULL, 'pending', 'userkeir123', 'userkeir123@gmail.com', '+639650637254', 'card', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-07 13:44:09', '2026-02-07 13:44:09'),
(2, 'ORD-20260207-71BCCB16', 2, '1239.84', NULL, NULL, NULL, 'pending', 'userkeir123', 'userkeir123@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-07 16:43:56', '2026-02-07 16:43:56'),
(3, 'ORD-20260209-5C257E13', 3, '187.76', NULL, NULL, NULL, 'completed', 'keir', 'keiry30@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-09 12:46:00', '2026-02-09 12:47:02'),
(4, 'ORD-20260210-5706B4C2', 6, '187.76', NULL, NULL, NULL, 'delivered', 'keirpogi', 'keirpogi@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-10 14:29:50', '2026-02-15 07:59:05'),
(5, 'ORD-20260211-A52E760C', 9, '547.28', NULL, NULL, NULL, 'pending', 'keirs', 'keir0@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-11 07:39:53', '2026-02-11 07:39:53'),
(6, 'ORD-20260211-29847E0E', 9, '1044.56', NULL, NULL, NULL, 'pending', 'keirs', 'keir0@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-11 07:40:34', '2026-02-11 07:40:34'),
(11, 'ORD-20260217-F04A9EB4', 14, '1187.20', NULL, NULL, NULL, 'pending', 'hahahaha', 'hahahaha@gmail.com', '+639650637254', 'gcash', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-17 04:29:01', '2026-02-17 04:29:01'),
(12, 'ORD-20260220-6ADA0633', 14, '88.08', NULL, NULL, NULL, 'pending', 'hahahaha', 'hahahaha@gmail.com', '+639650637254', 'gcash', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-20 12:21:11', '2026-02-20 12:21:11'),
(13, 'ORD-20260220-8ED438EA', 14, '88.08', NULL, NULL, NULL, 'pending', 'hahahaha', 'hahahaha@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-20 12:36:14', '2026-02-20 12:36:14'),
(14, 'ORD-20260220-6CF63A35', 14, '88.08', '34.00', '50.00', '4.08', 'delivered', 'hahahaha', 'hahahaha@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-20 12:46:12', '2026-02-20 14:35:32'),
(15, 'ORD-20260220-4EB737C4', 14, '88.08', '34.00', '50.00', '4.08', 'processing', 'hahahaha', 'hahahaha@gmail.com', '+639650637254', 'cod', 'pending', 'Purok 2. Maunlad Subdivision', 'Paombong', '3001', NULL, NULL, '', '2026-02-20 13:25:40', '2026-02-20 14:35:43'),
(16, 'ORD-20260221-D46E519B', 14, '144.08', '84.00', '50.00', '10.08', 'pending', 'hahahaha', 'hahahaha@gmail.com', '+639650637254', 'bank', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-02-21 00:52:35', '2026-02-21 00:52:35'),
(17, 'ORD-20260306-28F43AB4', 18, '1835.68', '1639.00', '0.00', '196.68', 'pending', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-06 12:09:36', '2026-03-06 12:09:36'),
(18, 'ORD-20260307-A8F77EEF', 18, '498.00', '400.00', '50.00', '48.00', 'completed', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-07 11:59:18', '2026-03-08 09:33:18'),
(19, 'ORD-20260307-631111CE', 18, '587.60', '480.00', '50.00', '57.60', 'delivered', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-07 14:48:17', '2026-03-08 09:33:12'),
(20, 'ORD-20260307-54622889', 18, '127.28', '69.00', '50.00', '8.28', 'completed', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-07 16:06:23', '2026-03-08 09:33:08'),
(21, 'ORD-20260308-240330D2', 18, '333.36', '253.00', '50.00', '30.36', 'delivered', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-08 09:15:00', '2026-03-08 09:32:55'),
(22, 'ORD-20260308-703884E3', 18, '806.00', '675.00', '50.00', '81.00', 'delivered', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-08 09:56:52', '2026-03-08 10:56:24'),
(23, 'ORD-20260308-432F78B8', 18, '151.92', '91.00', '50.00', '10.92', 'delivered', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-08 10:25:39', '2026-03-08 10:56:20'),
(24, 'ORD-20260308-B960AE7A', 18, '274.00', '200.00', '50.00', '24.00', 'pending', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-08 11:04:49', '2026-03-08 11:04:49'),
(25, 'ORD-20260308-B1239A79', 18, '113.84', '57.00', '50.00', '6.84', 'pending', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-08 11:05:42', '2026-03-08 11:05:42'),
(26, 'ORD-20260308-1E3FEBCD', 18, '113.84', '57.00', '50.00', '6.84', 'pending', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-08 11:13:48', '2026-03-08 11:13:48'),
(27, 'ORD-20260308-65E483EA', 18, '113.84', '57.00', '50.00', '6.84', 'pending', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-08 11:56:21', '2026-03-08 11:56:21'),
(28, 'ORD-20260308-3CB831AB', 18, '75.76', '23.00', '50.00', '2.76', 'cancelled', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-08 13:57:16', '2026-03-11 14:00:08'),
(29, 'ORD-20260308-4086C1FD', 18, '75.76', '23.00', '50.00', '2.76', 'completed', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-08 15:03:07', '2026-03-11 13:46:37'),
(30, 'ORD-20260309-12B577BD', 18, '182.16', '118.00', '50.00', '14.16', 'delivered', 'rhey', 'rhey@gmail.com', '+639650637254', 'cod', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-09 18:10:04', '2026-03-11 13:45:58'),
(31, 'ORD-20260311-E7493653', 18, '101.52', '46.00', '50.00', '5.52', 'completed', 'rhey', 'rhey@gmail.com', '+639650637254', 'card', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-11 05:21:58', '2026-03-11 13:44:12'),
(32, 'ORD-20260311-A9B74756', 18, '72.40', '20.00', '50.00', '2.40', 'cancelled', 'rhey', 'rhey@gmail.com', '+639650637254', 'gcash', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-11 05:31:12', '2026-03-11 14:43:56'),
(33, 'ORD-20260311-57D2E8A2', 18, '274.00', '200.00', '50.00', '24.00', 'delivered', 'rhey', 'rhey@gmail.com', '+639650637254', 'bank', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-11 15:21:47', '2026-03-11 16:06:38'),
(34, 'ORD-20260311-0B470DCF', 18, '274.00', '200.00', '50.00', '24.00', 'pending', 'rhey', 'rhey@gmail.com', '+639650637254', 'card', 'pending', 'Pinalagdan', 'Paombong', '3001', NULL, NULL, '', '2026-03-11 16:06:31', '2026-03-14 09:14:09'),
(35, 'ORD-20260319-D2EF20EB', 18, '117.20', '60.00', '50.00', '7.20', 'cancelled', 'rhey', 'rhey@gmail.com', '09473532433', 'card', 'pending', '359, Pinalagdan, paombong, bulacan', 'Bulacan', '3001', NULL, NULL, 'Hahhaa', '2026-03-19 15:21:49', '2026-03-19 15:22:27');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `selected_color` varchar(100) DEFAULT NULL,
  `selected_size` varchar(100) DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `price_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `selected_color`, `selected_size`, `original_price`, `quantity`, `product_price`, `subtotal`, `price_snapshot`, `product_snapshot`, `created_at`) VALUES
(13, 12, 22, 'PRODUCT 2', NULL, NULL, NULL, 1, '34.00', '34.00', NULL, NULL, '2026-02-20 12:21:11'),
(14, 13, 22, 'PRODUCT 2', NULL, NULL, NULL, 1, '34.00', '34.00', NULL, NULL, '2026-02-20 12:36:14'),
(15, 14, 22, 'PRODUCT 2', 'Blue', 'S', '234.00', 1, '34.00', '34.00', NULL, NULL, '2026-02-20 12:46:12'),
(16, 15, 22, 'PRODUCT 2', 'Navy', 'S', '234.00', 1, '34.00', '34.00', NULL, NULL, '2026-02-20 13:25:40'),
(17, 16, 22, 'PRODUCT 2', 'Navy', 'M', '234.00', 1, '34.00', '34.00', NULL, NULL, '2026-02-21 00:52:35'),
(18, 16, 23, 'new product', 'Blue', 'XL', '300.00', 1, '50.00', '50.00', NULL, NULL, '2026-02-21 00:52:35'),
(19, 17, 22, 'PRODUCT 2', 'Navy', 'S', '234.00', 2, '34.00', '68.00', NULL, NULL, '2026-03-06 12:09:36'),
(20, 17, 22, 'PRODUCT 2', 'Blue', 'L', '234.00', 21, '34.00', '714.00', NULL, NULL, '2026-03-06 12:09:36'),
(21, 17, 22, 'PRODUCT 2', '', '', '234.00', 1, '34.00', '34.00', NULL, NULL, '2026-03-06 12:09:36'),
(22, 17, 21, 'TRY NEW', 'Black', '3XL', '123.00', 1, '23.00', '23.00', NULL, NULL, '2026-03-06 12:09:36'),
(23, 17, 23, 'new product', 'Blue', '2XL', '300.00', 16, '50.00', '800.00', NULL, NULL, '2026-03-06 12:09:36'),
(26, 20, 21, 'TRY NEW', '', '', '123.00', 3, '23.00', '69.00', NULL, NULL, '2026-03-07 16:06:23'),
(27, 21, 23, 'new product', '', '', '300.00', 3, '50.00', '150.00', NULL, NULL, '2026-03-08 09:15:00'),
(28, 21, 22, 'PRODUCT 2', '', '', '234.00', 1, '34.00', '34.00', NULL, NULL, '2026-03-08 09:15:00'),
(29, 21, 21, 'TRY NEW', '', '', '123.00', 3, '23.00', '69.00', NULL, NULL, '2026-03-08 09:15:00'),
(30, 22, 23, 'new product', '', '', '300.00', 3, '50.00', '150.00', NULL, NULL, '2026-03-08 09:56:52'),
(31, 22, 22, 'PRODUCT 2', 'Blue', 'M', '234.00', 3, '34.00', '102.00', NULL, NULL, '2026-03-08 09:56:52'),
(32, 22, 21, 'TRY NEW', 'Black', '2XL', '123.00', 1, '23.00', '23.00', NULL, NULL, '2026-03-08 09:56:52'),
(33, 22, 25, 'FOTHwhs', 'Navy', 'M', '250.00', 2, '200.00', '400.00', NULL, NULL, '2026-03-08 09:56:52'),
(34, 23, 22, 'PRODUCT 2', 'Blue', 'L', '234.00', 2, '34.00', '68.00', NULL, NULL, '2026-03-08 10:25:39'),
(35, 23, 21, 'TRY NEW', 'Black', '3XL', '123.00', 1, '23.00', '23.00', NULL, NULL, '2026-03-08 10:25:39'),
(36, 24, 25, 'FOTHwhs', 'Red', 'M', '250.00', 1, '200.00', '200.00', NULL, NULL, '2026-03-08 11:04:49'),
(37, 25, 21, 'TRY NEW', 'Black', '3XL', '123.00', 1, '23.00', '23.00', NULL, NULL, '2026-03-08 11:05:42'),
(38, 25, 22, 'PRODUCT 2', 'Blue', 'M', '234.00', 1, '34.00', '34.00', NULL, NULL, '2026-03-08 11:05:42'),
(39, 26, 21, 'TRY NEW', 'Black', '2XL', '123.00', 1, '23.00', '23.00', NULL, NULL, '2026-03-08 11:13:48'),
(40, 26, 22, 'PRODUCT 2', 'Blue', 'L', '234.00', 1, '34.00', '34.00', NULL, NULL, '2026-03-08 11:13:48'),
(41, 27, 22, 'PRODUCT 2', 'Blue', 'M', '234.00', 1, '34.00', '34.00', NULL, NULL, '2026-03-08 11:56:21'),
(42, 27, 21, 'TRY NEW', 'Black', '3XL', '123.00', 1, '23.00', '23.00', NULL, NULL, '2026-03-08 11:56:21'),
(43, 28, 21, 'TRY NEW', 'Black', '3XL', '123.00', 1, '23.00', '23.00', NULL, NULL, '2026-03-08 13:57:16'),
(44, 29, 21, 'TRY NEW', 'Green', '3XL', '123.00', 1, '23.00', '23.00', NULL, NULL, '2026-03-08 15:03:07'),
(45, 30, 22, 'PRODUCT 2', 'Navy', 'S', '234.00', 2, '34.00', '68.00', NULL, NULL, '2026-03-09 18:10:04'),
(46, 30, 23, 'new product', 'Blue', '3XL', '300.00', 1, '50.00', '50.00', NULL, NULL, '2026-03-09 18:10:04'),
(47, 31, 21, 'TRY NEW', 'Green', '3XL', '123.00',
