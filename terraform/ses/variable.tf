variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1" # Singapore region
}
variable "domain" {
  description = "The domain name to use"
  type        = string
  default     = "alkahfi-store21.com" 
}

variable "shared_credentials_file" {
  description = "The path to the shared AWS credentials file"
  type        = string
  default     = "~/.aws/credentials"
}

variable "email_addresses" {
  description = "The list of email addresses to verify with SES"
  type        = list(string)
  default     = [
    "santoadji2197@gmail.com",
    "ikhwangaul21@gmail.com",
  ]
}
