document.addEventListener('DOMContentLoaded', () => {
    const app = {
        // Configuration
        DEFAULT_CIK: '0000004904',
        USER_AGENT: 'somerw12se1212re Project contact@example.com',
        
        // DOM Elements
        elements: {
            title: document.querySelector('title'),
            entityName: document.getElementById('share-entity-name'),
            maxValue: document.getElementById('share-max-value'),
            maxFy: document.getElementById('share-max-fy'),
            minValue: document.getElementById('share-min-value'),
            minFy: document.getElementById('share-min-fy'),
            loader: document.getElementById('loader'),
            errorMessage: document.getElementById('error-message'),
            dataDisplay: document.getElementById('data-display'),
        },

        init() {
            const urlParams = new URLSearchParams(window.location.search);
            let cik = urlParams.get('CIK');

            if (cik && /^\d{1,10}$/.test(cik)) {
                cik = this.padCik(cik);
            } else {
                cik = this.DEFAULT_CIK;
            }
            
            this.loadCompanyData(cik);
        },

        padCik(cik) {
            return cik.toString().padStart(10, '0');
        },

        showLoading(isLoading) {
            this.elements.loader.classList.toggle('hidden', !isLoading);
            this.elements.dataDisplay.classList.toggle('hidden', isLoading);
            this.elements.errorMessage.classList.add('hidden');
        },

        showError(message) {
            this.elements.errorMessage.textContent = message;
            this.elements.errorMessage.classList.remove('hidden');
            this.elements.dataDisplay.classList.add('hidden');
            this.elements.entityName.textContent = 'Error';
            this.elements.title.textContent = 'Error | SEC Share Data';
        },

        formatEntityName(name) {
            return name.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase()).replace(/ (Inc|Llc|Co|Lp)\b/g, s => s.toUpperCase());
        },

        async loadCompanyData(cik) {
            this.showLoading(true);
            const secUrl = `https://data.sec.gov/api/xbrl/companyconcept/CIK${cik}/dei/EntityCommonStockSharesOutstanding.json`;
            const proxyUrl = `https://corsproxy.io/?${secUrl}`;

            try {
                const response = await fetch(proxyUrl, {
                    headers: { 'User-Agent': this.USER_AGENT }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch data from SEC. Status: ${response.status}`);
                }

                const rawData = await response.json();
                const processedData = this.processData(rawData);

                if (!processedData) {
                    throw new Error('No relevant share data found for fiscal years after 2020.');
                }

                this.updateUI(processedData);

            } catch (error) {
                console.error('Error loading company data:', error);
                this.showError(`Could not retrieve data for CIK ${cik}. Please check the CIK or try again later.`);
            } finally {
                this.showLoading(false);
            }
        },

        processData(rawData) {
            if (!rawData || !rawData.units || !rawData.units.shares) {
                return null;
            }

            const entityName = rawData.entityName || 'Unknown Company';
            const filteredShares = rawData.units.shares.filter(
                item => item.fy > 2020 && typeof item.val === 'number'
            );

            if (filteredShares.length === 0) {
                return null;
            }

            const result = filteredShares.reduce((acc, current) => {
                if (!acc.min || current.val < acc.min.val) {
                    acc.min = { val: current.val, fy: current.fy };
                }
                if (!acc.max || current.val > acc.max.val) {
                    acc.max = { val: current.val, fy: current.fy };
                }
                return acc;
            }, { min: null, max: null });

            return { entityName, ...result };
        },

        updateUI(data) {
            const formattedName = this.formatEntityName(data.entityName);
            
            this.elements.title.textContent = `${formattedName} | SEC Share Data`;
            this.elements.entityName.textContent = formattedName;

            this.elements.maxValue.textContent = data.max.val.toLocaleString('en-US');
            this.elements.maxFy.textContent = data.max.fy;

            this.elements.minValue.textContent = data.min.val.toLocaleString('en-US');
            this.elements.minFy.textContent = data.min.fy;
        }
    };

    app.init();
});
