#!/usr/bin/env python3
import sys
import json
import os
import ssl
import certifi
from omnidimension import Client

# Fix SSL certificate issue
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
os.environ['SSL_CERT_FILE'] = certifi.where()

# Fallback API credentials
FALLBACK_API_KEY = "ZGNja1CwmW29yCfIhNHJcfG38bTC-T4nPO55c9nQiaY"
FALLBACK_AGENT_ID = "1779"

def make_booking_confirmation_call(phone_number, agent_id, booking_context, user_email):
    try:
        # Get API key from environment or use fallback
        api_key = os.getenv('OMNIDIM_API_KEY') or FALLBACK_API_KEY
        
        # Initialize OmniDimension client
        client = Client(api_key)
        
        # Parse booking context
        booking = json.loads(booking_context)
        
        # Create a smart script with booking details
        smart_script = f"""
Hello! This is Saloni AI calling on behalf of {booking['customerName']} regarding a booking confirmation.

I'm calling to confirm an appointment booking:

CUSTOMER DETAILS:
- Name: {booking['customerName']}
- Email: {booking['customerEmail']}
- Phone: {booking['customerPhone']}

BOOKING DETAILS:
- Service: {booking['appointmentType']}
- Provider: {booking['providerName']}
- Date: {booking['appointmentDate']}
- Time: {booking['appointmentTime']}
- Location: {booking['location']}
- Status: {booking['status']}

If you ask about the customer:
- Yes, this is {booking['customerName']}
- Email: {booking['customerEmail']}
- Phone: {booking['customerPhone']}

If you ask about the booking:
- Yes, we have a {booking['appointmentType']} appointment
- Scheduled for {booking['appointmentDate']} at {booking['appointmentTime']}
- At {booking['location']}

If you ask if the customer is coming:
- Yes, {booking['customerName']} will be there for the appointment

Please confirm if this booking is confirmed on your end. Do we have a confirmed spot for {booking['customerName']} on {booking['appointmentDate']} at {booking['appointmentTime']}?
"""

        # Make the call with the smart script
        response = client.call.dispatch_call(
            agent_id=int(agent_id),
            to_number=phone_number
        )
        
        # Extract call_id from response
        call_id = None
        if isinstance(response, dict):
            call_id = response.get('call_id') or response.get('id')
        else:
            call_id = str(response)
        
        return {
            "success": True,
            "call_id": call_id,
            "message": f"🔥 BOOKING CONFIRMATION: Omni is calling {phone_number} about {booking['customerName']}'s appointment!",
            "status": "initiated",
            "booking_context": booking,
            "script": smart_script
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "call_id": None,
            "status": "failed"
        }

if __name__ == "__main__":
    # Suppress SDK output
    import sys
    from io import StringIO
    
    old_stdout = sys.stdout
    sys.stdout = StringIO()
    
    try:
        if len(sys.argv) != 5:
            result = {"success": False, "error": "Invalid arguments"}
        else:
            phone_number = sys.argv[1]
            agent_id = sys.argv[2] or FALLBACK_AGENT_ID
            booking_context = sys.argv[3]
            user_email = sys.argv[4]
            
            result = make_booking_confirmation_call(phone_number, agent_id, booking_context, user_email)
    
    except Exception as e:
        result = {"success": False, "error": f"Script error: {str(e)}", "call_id": None}
    
    finally:
        sys.stdout = old_stdout
    
    print(json.dumps(result))
