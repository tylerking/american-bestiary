CREATE INDEX "events_created_at_index" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" USING btree ("user_id");