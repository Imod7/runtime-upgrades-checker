
const axios = require('axios');
const BASE_URL = 'http://127.0.0.1:8080';

const colours = {
    reset: "\x1b[0m",
    fg: {
        red: "\x1b[1m\x1b[31m",
        green: "\x1b[1m\x1b[32m",
        yellow: "\x1b[1m\x1b[33m",
        cyan: "\x1b[36m",
    },
};

async function getRuntime(args) {
    let countUpgrades = 0;
    let countTotal = 0;
    args = args != null ? '?at=' + args : '';
    const endpoint = `${BASE_URL}` + '/pallets/on-going-referenda' + args;
    const spec = await axios.get(`${BASE_URL}` + '/runtime/spec');
    const specName = spec.data.specName;
    let onGoingRef = null;
    try {
        onGoingRef = await axios.get(endpoint);

        if (onGoingRef.data != undefined && onGoingRef.data.referenda?.length != 0) {
            for (const referenda of onGoingRef.data.referenda) {
                countTotal++;
                const refId = referenda.id.replace(/[,]+/g, '').trim();
                const title = await getTitle(refId, specName);
                const regex = /\bupgrade\b/i;
                const upgradeWordFound = regex.test(title);
                console.log(`\n${colours.fg.yellow}${countTotal}. Ref Title:${colours.reset} ${title}`);
                console.log(`Ref Details:`, referenda);
                if (upgradeWordFound) {
                    console.log(`⚠️ ${colours.fg.red} ATTENTION : Title shows it is an upgrade - Check if it is a relevant one for your case ${colours.reset}⚠️`);
                    countUpgrades++;
                }
            }
        } else {
            console.log("✅ No On Going Referendas!!!")
        }
    } catch (error) {
        if (error.response) {
            console.error(`${colours.fg.red}Error${colours.reset}: ${error.response.data.message}`);
        } else {
            console.error(`${colours.fg.red}Error${colours.reset}: ${error}`);
        }
    }

    return [countUpgrades, countTotal];
}

async function getTitle(id, specName) {
		const res = await fetch(
			'https://api.polkassembly.io/api/v1/posts/on-chain-post?postId=' + id + '&proposalType=referendums_v2',
			{
				method: 'GET',
				headers: {
					'x-network': specName,
					'Content-Type': 'application/json',
				},
			},
		);
		const answer = await res.json();
		return answer.title;
}

const main = async () => {
    var arguments = process.argv;
    const [countUpgrades, countTotal] = await getRuntime(arguments[2]);
    if (countUpgrades > 0) {
        console.log(`\n‼️ ${colours.fg.red} ATTENTION : At least ${countUpgrades} out of ${countTotal} referendas should be checked ${colours.reset}‼️`);
    }
};

main();
