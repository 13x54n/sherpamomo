#!/usr/bin/env bash
# Quick test for custom backend phone auth (no Firebase required).
# Usage: ./scripts/test-phone-auth.sh [BASE_URL]
# Example: ./scripts/test-phone-auth.sh http://localhost:5001

set -e
BASE_URL="${1:-http://localhost:5001}"
TEST_PHONE="+14167258527"
TEST_CODE="123456"

echo "Testing phone auth at $BASE_URL"
echo ""

echo "1. Request verification code for $TEST_PHONE..."
REQUEST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/phone/request" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$TEST_PHONE\"}")
echo "$REQUEST_RESPONSE" | head -c 200
echo ""
if echo "$REQUEST_RESPONSE" | grep -q "Verification code sent"; then
  echo "   OK: Code requested"
else
  echo "   FAIL: Expected 'Verification code sent'"
  exit 1
fi
echo ""

echo "2. Verify with code $TEST_CODE and get JWT..."
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/phone/verify" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$TEST_PHONE\", \"code\": \"$TEST_CODE\"}")
echo "$VERIFY_RESPONSE" | head -c 300
echo ""
if echo "$VERIFY_RESPONSE" | grep -q "token"; then
  echo "   OK: Signed in, token received"
  TOKEN=$(echo "$VERIFY_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  if [ -n "$TOKEN" ]; then
    echo "   Token (first 50 chars): ${TOKEN:0:50}..."
  fi
else
  echo "   FAIL: Expected response with 'token'"
  exit 1
fi
echo ""
echo "Done. Use the token in Authorization: Bearer <token> for protected routes."
