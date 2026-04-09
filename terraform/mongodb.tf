resource "mongodbatlas_project" "bestiary" {
  name   = var.atlas_project_name
  org_id = var.atlas_org_id
}

resource "mongodbatlas_cluster" "bestiary" {
  project_id = mongodbatlas_project.bestiary.id
  name       = var.atlas_cluster_name

  provider_name               = "TENANT"
  backing_provider_name       = "AWS"
  provider_region_name        = var.atlas_region
  provider_instance_size_name = "M0"
}

resource "mongodbatlas_database_user" "app_user" {
  project_id         = mongodbatlas_project.bestiary.id
  username           = "bestiary-app"
  password           = var.atlas_db_password
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = "bestiary"
  }

  labels {
    key   = "environment"
    value = "production"
  }
}

resource "mongodbatlas_project_ip_access_list" "allow_all" {
  project_id = mongodbatlas_project.bestiary.id
  cidr_block = "0.0.0.0/0"
}
