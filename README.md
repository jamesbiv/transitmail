# TransitMail Client

<b>Current version:</b> 1.0.0 (beta)

TransitMail is a lightweight Progrssive Web Application (PWA) based email client, designed to take the hard work out of establishing email services.

The key features of TransitMail as follows:

<ul>
<li>Built with ReactJS</li>
<li>Built with Bootstrap</li>
<li>Works as a Progessive Web Application</li>
<li>Relies only on traditional IMAP and SMTP protocals</li>
<li>Uses WebSockets for its communications</li>
<li>Easy to use, setup and deploy</li>
</ul>

The benefits of TransitMail are the combination of these services, SSL certificate negoitation happens at the WebSocket layer. Meaning that SMTPS and IMAP-SSL are not requireds, thereby, minimising complex mail server configurations, while at the same time maintaining secure communications.

# TransitMail Development Server

You can download the TransitMail Development Server Dockerfile install at [jamestbiv/transitmail-dev-server](https://github.com/jamesbiv/transitmail-dev-server).

This configuration will give you all the tools needed to test and run a TransitMail server. For a production ready service, DKIMs will need to be installed.

## Installation

### Clone this respository

```
git clone https://github.com/jamesbiv/transitmail

```

### Run yarn install

```
yarn install
```

### Build TransitMail

```
yarn build
```

### Serve locally (development mode)

```
yarn start
```

## Licence

This project is licenced under GPL-2.0

## Further Information

For a more in depth understanding about TransitMail (including screenshots), please visit [jamesbiv.tech/transitmail](https://jamesbiv.tech/transitmail).

Contribution is more than welcome, please read our contribution guidlines at [CONTRIBUTORS.md](CONTRIBUTORS.md). And the project roadmap at [projects/roadmap](projects/roadmap).
