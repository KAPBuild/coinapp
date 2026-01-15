CREATE TABLE IF NOT EXISTS `coins` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`quantity` real NOT NULL,
	`purchase_price` real NOT NULL,
	`current_price` real,
	`bullion_value` real,
	`melt_value` real,
	`grading` text,
	`notes` text,
	`purchase_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `token_idx` ON `sessions` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);