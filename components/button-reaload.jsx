'use client';

export default function ButtonReload() {
    const handleClick = async () => {
        try {
            const response = await fetch('/api/articles', { next: { revalidate: 0 }});
            if (response.ok) {
                alert('Articles reloaded');
                window.location.reload();
            } else {
                console.error('API request failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleClick} type="button" className="btn btn-primary btn-sm mx-2">
            Refresh articles
        </button>
    );
}
