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

def make_call(phone_number, agent_id, call_reason, user_email):
    try:
        # Get API key from environment or use fallback
        api_key = os.getenv('OMNIDIM_API_KEY') or FALLBACK_API_KEY
        
        # Initialize OmniDimension client
        client = Client(api_key)
        
        # Use the correct method with only required parameters
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
            "message": f"🔥 REAL CALL: OmniDimension is calling {phone_number} RIGHT NOW!",
            "status": "initiated",
            "data": response if isinstance(response, dict) else {"response": str(response)}
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
            call_reason = sys.argv[3]
            user_email = sys.argv[4]
            
            result = make_call(phone_number, agent_id, call_reason, user_email)
    
    except Exception as e:
        result = {"success": False, "error": f"Script error: {str(e)}", "call_id": None}
    
    finally:
        sys.stdout = old_stdout
    
    print(json.dumps(result))
