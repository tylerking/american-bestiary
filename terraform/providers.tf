terraform {
  required_version = ">= 1.6"

  required_providers {
    netlify = {
      source  = "netlify/netlify"
      version = "~> 0.4"
    }
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.14"
    }
  }
}

provider "netlify" {
  token             = var.netlify_token
  default_team_slug = var.netlify_team_slug
}

provider "mongodbatlas" {
  public_key  = var.atlas_public_key
  private_key = var.atlas_private_key
}
