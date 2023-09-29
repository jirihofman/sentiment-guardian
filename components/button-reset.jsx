'use client';

export default function ButtonReset() {
    const handleClick = async () => {
        const confirmed = confirm('Are you sure you want to reset the database?');
        if (!confirmed) {
            return;
        }
        try {
            const response = await fetch('/api/reset', { next: { revalidate: 0 }});
            if (response.ok) {
                alert('Reset done');
                window.location.reload();
            } else {
                console.error('API request failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleClick} type="button" className="btn btn-danger mx-2">
            Reset
        </button>
    );
}
