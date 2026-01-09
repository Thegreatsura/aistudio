CREATE TABLE "affiliate_earning" (
	"id" text PRIMARY KEY NOT NULL,
	"affiliate_workspace_id" text NOT NULL,
	"affiliate_relationship_id" text NOT NULL,
	"invoice_id" text NOT NULL,
	"invoice_amount_ore" integer NOT NULL,
	"commission_percent" integer NOT NULL,
	"earning_amount_ore" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paid_out_at" timestamp,
	"paid_out_reference" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliate_relationship" (
	"id" text PRIMARY KEY NOT NULL,
	"affiliate_workspace_id" text NOT NULL,
	"referred_workspace_id" text NOT NULL,
	"commission_percent" integer DEFAULT 20 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"workspace_id" text NOT NULL,
	"role" text DEFAULT 'owner' NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invitation_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"fiken_invoice_id" integer,
	"fiken_invoice_number" text,
	"fiken_contact_id" integer,
	"total_amount_ore" integer NOT NULL,
	"currency" text DEFAULT 'NOK' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"issue_date" timestamp,
	"due_date" timestamp,
	"paid_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_line_item" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"project_id" text,
	"video_project_id" text,
	"description" text NOT NULL,
	"amount_ore" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"invoice_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_payment" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"payment_method" text NOT NULL,
	"stripe_checkout_session_id" text,
	"stripe_payment_intent_id" text,
	"invoice_line_item_id" text,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_payment_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "stripe_customer" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stripe_customer_workspace_id_unique" UNIQUE("workspace_id"),
	CONSTRAINT "stripe_customer_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "workspace_pricing" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"image_project_price_ore" integer,
	"video_project_price_ore" integer,
	"fiken_contact_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_pricing_workspace_id_unique" UNIQUE("workspace_id")
);
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp;--> statement-breakpoint
ALTER TABLE "video_clip" ALTER COLUMN "transition_type" SET DEFAULT 'seamless';--> statement-breakpoint
ALTER TABLE "video_clip" ADD COLUMN "transition_clip_url" text;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "invoice_eligible" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "invoice_eligible_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "invited_by_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "affiliate_earning" ADD CONSTRAINT "affiliate_earning_affiliate_workspace_id_workspace_id_fk" FOREIGN KEY ("affiliate_workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_earning" ADD CONSTRAINT "affiliate_earning_affiliate_relationship_id_affiliate_relationship_id_fk" FOREIGN KEY ("affiliate_relationship_id") REFERENCES "public"."affiliate_relationship"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_earning" ADD CONSTRAINT "affiliate_earning_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_relationship" ADD CONSTRAINT "affiliate_relationship_affiliate_workspace_id_workspace_id_fk" FOREIGN KEY ("affiliate_workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_relationship" ADD CONSTRAINT "affiliate_relationship_referred_workspace_id_workspace_id_fk" FOREIGN KEY ("referred_workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_video_project_id_video_project_id_fk" FOREIGN KEY ("video_project_id") REFERENCES "public"."video_project"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_line_item" ADD CONSTRAINT "invoice_line_item_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_payment" ADD CONSTRAINT "project_payment_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_payment" ADD CONSTRAINT "project_payment_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_payment" ADD CONSTRAINT "project_payment_invoice_line_item_id_invoice_line_item_id_fk" FOREIGN KEY ("invoice_line_item_id") REFERENCES "public"."invoice_line_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_customer" ADD CONSTRAINT "stripe_customer_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_pricing" ADD CONSTRAINT "workspace_pricing_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "affiliate_earning_affiliate_idx" ON "affiliate_earning" USING btree ("affiliate_workspace_id");--> statement-breakpoint
CREATE INDEX "affiliate_earning_invoice_idx" ON "affiliate_earning" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "affiliate_earning_status_idx" ON "affiliate_earning" USING btree ("status");--> statement-breakpoint
CREATE INDEX "affiliate_relationship_affiliate_idx" ON "affiliate_relationship" USING btree ("affiliate_workspace_id");--> statement-breakpoint
CREATE INDEX "affiliate_relationship_referred_idx" ON "affiliate_relationship" USING btree ("referred_workspace_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "invitation_token_idx" ON "invitation" USING btree ("token");--> statement-breakpoint
CREATE INDEX "invitation_workspace_idx" ON "invitation" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "invoice_workspace_idx" ON "invoice" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "invoice_status_idx" ON "invoice" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoice_fiken_idx" ON "invoice" USING btree ("fiken_invoice_id");--> statement-breakpoint
CREATE INDEX "invoice_line_item_workspace_idx" ON "invoice_line_item" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "invoice_line_item_status_idx" ON "invoice_line_item" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoice_line_item_invoice_idx" ON "invoice_line_item" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "invoice_line_item_project_idx" ON "invoice_line_item" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "invoice_line_item_video_idx" ON "invoice_line_item" USING btree ("video_project_id");--> statement-breakpoint
CREATE INDEX "project_payment_project_idx" ON "project_payment" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_payment_workspace_idx" ON "project_payment" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "project_payment_status_idx" ON "project_payment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_payment_stripe_session_idx" ON "project_payment" USING btree ("stripe_checkout_session_id");--> statement-breakpoint
CREATE INDEX "stripe_customer_workspace_idx" ON "stripe_customer" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "stripe_customer_stripe_idx" ON "stripe_customer" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "workspace_pricing_workspace_idx" ON "workspace_pricing" USING btree ("workspace_id");--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_impersonated_by_user_id_fk" FOREIGN KEY ("impersonated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;