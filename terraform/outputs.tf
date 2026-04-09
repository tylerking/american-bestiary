output "netlify_project_url" {
  description = "The live URL of your American Bestiary project"
  value       = "https://${data.netlify_site.bestiary.name}.netlify.app"
}

output "netlify_project_id" {
  description = "The API ID for your Netlify project (Store this as NETLIFY_PROJECT_ID in GitHub Secrets)"
  value       = data.netlify_site.bestiary.id
}

output "mongodb_uri" {
  description = "The connection string for the newly created Atlas cluster"
  value       = local.mongodb_uri
  sensitive   = true
}
