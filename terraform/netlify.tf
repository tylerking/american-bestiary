data "netlify_site" "bestiary" {
  name = "american-bestiary"
}

locals {
  atlas_host = replace(
    mongodbatlas_cluster.bestiary.connection_strings[0].standard_srv,
    "mongodb+srv://",
    "",
  )

  mongodb_uri = "mongodb+srv://bestiary-app:${var.atlas_db_password}@${local.atlas_host}/bestiary?retryWrites=true&w=majority"
}

resource "netlify_site_build_settings" "bestiary" {
  site_id = data.netlify_site.bestiary.id

  build_command     = "pnpm run build"
  publish_directory = "build"
  production_branch = var.github_branch
}

resource "netlify_environment_variable" "mongodb_uri" {
  site_id = data.netlify_site.bestiary.id
  key     = "MONGODB_URI"

  values = [
    {
      value   = local.mongodb_uri
      context = "all"
    }
  ]
}

resource "netlify_environment_variable" "node_env" {
  site_id = data.netlify_site.bestiary.id
  key     = "NODE_ENV"

  values = [
    {
      value   = "production"
      context = "production"
    },
    {
      value   = "development"
      context = "deploy-preview"
    }
  ]
}
