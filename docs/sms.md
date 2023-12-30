# SMS

We use AWS SNS to send SMS messages. To send an SMS message in AWS, there are some setup steps required:

1. Create an origination number (the phone number that the SMS message will be sent from). You will need a type that supports SMS. Learn more [here](https://docs.aws.amazon.com/sns/latest/dg/channels-sms-originating-identities-origination-numbers.html).
2. Register the origination number with AWS. Learn more [here](https://docs.aws.amazon.com/sns/latest/dg/channels-sms-originating-identities-sending-sms-origination.html).
3. Verify a phone number that you want to send SMS messages to. Learn more [here](https://docs.aws.amazon.com/sns/latest/dg/sns-sms-sandbox-verifying-phone-numbers.html).
4. When you're ready to utilize this feature in production, you will need to request to move out of the SMS sandbox. Learn more [here](https://docs.aws.amazon.com/sns/latest/dg/sns-sms-sandbox-moving-to-production.html).
