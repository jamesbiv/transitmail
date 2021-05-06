import { EmailParser } from "classes";

const mockEmailRaw: any = `Return-Path: sender@testserver.com
Date: Thu, 01 Apr 2021 18:46:18 -0300
To: receiver@testserver.com
CC: 
Subject: (no subject)
Message-ID: <60663F2A-000016D7@test-mail-server01.testserver.com>
From: "Test Sender" <sender@testserver.com>
Received: from mail.testserver.com (test-mail-server01.testserver.com [127.0.0.1])
	by test-mail-server01.testserver.com; Thu, 01 Apr 2021 18:46:18 -0300
Bcc: 
MIME-Version: 1.0
X-Mailer: Transit alpha0.0.1
Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"


--transit--client--6ohw29r5
Content-Type: text/plain; charset="utf-8"

asdasdas


--transit--client--6ohw29r5
Content-Type: text/html; charset="utf-8"

<p>asdasdas</p>

--transit--client--6ohw29r5--`;

const mockProcessEmailResponse: any = {
  bodyText: `urn-Path: sender@testserver.com
Date: Thu, 01 Apr 2021 18:46:18 -0300
To: receiver@testserver.com
CC:
Subject: (no subject)
Message-ID: <60663F2A-000016D7@test-mail-server01.testserver.com>
From: "Test Sender" <sender@testserver.com>
Received: from mail.testserver.com (test-mail-server01.testserver.com [127.0.0.1])
 	by test-mail-server01.testserver.com; Thu, 01 Apr 2021 18:46:18 -0300
Bcc:
MIME-Version: 1.0
X-Mailer: Transit alpha0.0.1
Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"
  
  
--transit--client--6ohw29r5
Content-Type: text/plain; charset="utf-8"
  
 asdasdas
  
  
--transit--client--6ohw29r5
Content-Type: text/html; charset="utf-8"
  
<p>asdasdas</p>
  
--transit--client--6ohw29r5-`,
  boundaries: [],
  contentRaw: `urn-Path: sender@testserver.com
Date: Thu, 01 Apr 2021 18:46:18 -0300
To: receiver@testserver.com
CC:
Subject: (no subject)
Message-ID: <60663F2A-000016D7@test-mail-server01.testserver.com>
From: "Test Sender" <sender@testserver.com>
Received: from mail.testserver.com (test-mail-server01.testserver.com [127.0.0.1])
 	by test-mail-server01.testserver.com; Thu, 01 Apr 2021 18:46:18 -0300
Bcc:
MIME-Version: 1.0
X-Mailer: Transit alpha0.0.1
Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"


--transit--client--6ohw29r5
Content-Type: text/plain; charset="utf-8"

asdasdas


--transit--client--6ohw29r5
Content-Type: text/html; charset="utf-8"

<p>asdasdas</p>

--transit--client--6ohw29r5-`,
  emailRaw: `Return-Path: sender@testserver.com
Date: Thu, 01 Apr 2021 18:46:18 -0300
To: receiver@testserver.com
CC:
Subject: (no subject)
Message-ID: <60663F2A-000016D7@test-mail-server01.testserver.com>
From: "Test Sender" <sender@testserver.com>
Received: from mail.testserver.com (test-mail-server01.testserver.com [127.0.0.1])
 	by test-mail-server01.testserver.com; Thu, 01 Apr 2021 18:46:18 -0300
Bcc:
MIME-Version: 1.0
X-Mailer: Transit alpha0.0.1
Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"


--transit--client--6ohw29r5
Content-Type: text/plain; charset="utf-8"

asdasdas


--transit--client--6ohw29r5
Content-Type: text/html; charset="utf-8"

<p>asdasdas</p>

--transit--client--6ohw29r5--`,
  headers: {},
  headersRaw: "",
};

const emailParser = new EmailParser();

describe("Testing the EmailParser class", () => {
  test("Test processEmail", () => {
    const processEmailResponse: any = emailParser.processEmail(mockEmailRaw);

    expect(processEmailResponse).toEqual(mockProcessEmailResponse);
  });
});
