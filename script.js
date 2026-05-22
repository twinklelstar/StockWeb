// Supabase configuration - fetched from backend environment variables
let supabaseClient;

async function initializeSupabase() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        
        const { createClient } = window.supabase;
        supabaseClient = createClient(config.supabaseUrl, config.supabaseKey);
        
        // Load stocks after initialization
        loadStockData();
        subscribeToStockUpdates();
    } catch (error) {
        console.error('Error initializing Supabase:', error);
    }
}

// Fetch and display stock data
async function loadStockData() {
    try {
        const { data, error } = await supabaseClient
            .from('stocks')
            .select('*');
        
        if (error) throw error;
        
        // Create a map of categories to quantities
        const stockMap = {};
        if (data) {
            data.forEach(item => {
                stockMap[item.category] = item.quantity;
            });
        }
        
        // Update DOM with stock data
        document.getElementById('stock-minecraft').textContent = stockMap['minecraft'] || 0;
        document.getElementById('stock-roblox').textContent = stockMap['roblox'] || 0;
        document.getElementById('stock-edits').textContent = stockMap['edits'] || 0;
        
    } catch (error) {
        console.error('Error loading stock data:', error);
    }
}

// Real-time subscription to stock updates
function subscribeToStockUpdates() {
    supabaseClient
        .channel('stocks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stocks' }, 
            (payload) => {
                console.log('Stock updated:', payload);
                loadStockData(); // Reload data when changes occur
            }
        )
        .subscribe();
}

// Load stocks on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeSupabase();
});

function showAlert(){
    alert("This is placeholder content for now.");
}

/* SEARCH */

const searchInput = document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener("keyup", function(){

        let filter = searchInput.value.toLowerCase();

        let cards = document.querySelectorAll(".card");

        cards.forEach(card => {

            let title =
                card.querySelector("h2").innerText.toLowerCase();

            if(title.includes(filter)){
                card.style.display = "block";
            }else{
                card.style.display = "none";
            }
        });
    });
}
