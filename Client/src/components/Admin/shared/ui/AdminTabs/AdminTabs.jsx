import styles from "./adminTabs.module.css";

function AdminTabs({ tabs, activeTab, onTabChange }) {
	return (
		<div className={styles.tabs}>
			{tabs.map((tab) => {
				const value = typeof tab === "object" ? tab.value : tab;
				const label = typeof tab === "object" ? tab.label : tab;

				return (
					<button
						key={value}
						onClick={() => onTabChange(value)}
						className={
							activeTab === value
								? `${styles.tab} ${styles.active}`
								: styles.tab
						}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
}

export default AdminTabs;
