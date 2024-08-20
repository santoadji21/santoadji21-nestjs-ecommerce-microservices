provider "aws" {
  region = var.aws_region
}

# Loop through the list of email addresses and create SES Email Identities
resource "aws_ses_email_identity" "example" {
  count = length(var.email_addresses)
  email = var.email_addresses[count.index]  
}

# Create an IAM user for SMTP
resource "aws_iam_user" "ses_smtp_user" {
  name = "ses-smtp-user"
}

# Create access keys for the IAM user
resource "aws_iam_access_key" "ses_smtp_access_key" {
  user = aws_iam_user.ses_smtp_user.name
}

# Attach a policy to allow the IAM user to send emails using SES
resource "aws_iam_user_policy" "ses_send_email" {
  name = "ses-send-email"
  user = aws_iam_user.ses_smtp_user.name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ses:SendRawEmail",
      "Resource": "*"
    }
  ]
}
EOF
}

# Output the SMTP credentials
output "smtp_user" {
  value = aws_iam_access_key.ses_smtp_access_key.id
}

output "smtp_password" {
  value     = aws_iam_access_key.ses_smtp_access_key.secret
  sensitive = true  # Set to false if you want to see the password in the output
}

output "smtp_server" {
  value = "email-smtp.${var.aws_region}.amazonaws.com"
}

# Output the verified email identities
output "verified_emails" {
  value = aws_ses_email_identity.example[*].id
}
