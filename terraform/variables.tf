variable "netlify_token" {
  description = "Netlify personal access token (Settings → OAuth → Personal access tokens)"
  type        = string
  sensitive   = true
}

variable "netlify_team_slug" {
  description = "The slug of your Netlify team"
  type        = string
}

variable "atlas_org_id" {
  description = "MongoDB Atlas organization ID (visible in Atlas → Settings)"
  type        = string
}

variable "atlas_public_key" {
  description = "MongoDB Atlas API public key (Atlas → Access Manager → API Keys)"
  type        = string
  sensitive   = true
}

variable "atlas_private_key" {
  description = "MongoDB Atlas API private key"
  type        = string
  sensitive   = true
}

variable "atlas_db_password" {
  description = "Password for the bestiary-app MongoDB Atlas database user"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "GitHub repository in owner/repo format"
  type        = string
  default     = "tylerking/american-bestiary"
}

variable "github_branch" {
  description = "Branch to deploy from"
  type        = string
  default     = "main"
}

variable "atlas_region" {
  description = "AWS region for the MongoDB Atlas cluster"
  type        = string
  default     = "US_WEST_2"
}

variable "atlas_project_name" {
  description = "The name of the project in MongoDB Atlas"
  type        = string
  default     = "american-bestiary"
}

variable "atlas_cluster_name" {
  description = "The name of the cluster in MongoDB Atlas"
  type        = string
  default     = "bestiary-cluster"
}
