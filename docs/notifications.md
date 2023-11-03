# Notifications Features

This RA provides ready to use solutions for notification systems listed below. 
However, the project can be integrated with other notification 
systems depending on the requirements. 

- AWS SES (Simple Email Service)

## AWS SES
This project provides AWS SES module to send emails. To use this feature, you must have an AWS account and SES configured. The following environment variables must be set:

```bash
AWS_ACCESS_KEY_ID=some-id
AWS_REGION=some-region
AWS_SECRET_ACCESS_KEY=some-access-key
# if you have a default sender
TACH_EMAIL_SOURCE=your_sender_email@yourdomain
```

__Reminder:__ By default, AWS SES operates in Sandbox mode, which has some limitations, such as only sending emails to verified email addresses and domains. However, you can move out of the Sandbox mode by following the instructions provided in the [Moving out of the Amazon SES sandbox](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html) documentation.

__Endpoint:__ `POST /api/notifications/email`

__Palyoad:__
```json
{
   "recipient": "exampleemail@example.com",
   "subject": "Test SES",
   "text": "Just testing the SES functionality",
   "sender": "noreply2@example.com"
}
```
