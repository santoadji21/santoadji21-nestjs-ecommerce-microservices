
variable "region" {
  description = "The AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "shared_credentials_file" {
  description = "The path to the shared credentials file"
  type        = string
  default     = "~/.aws/credentials"
}